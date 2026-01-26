import React, { useMemo, useState, useRef, useCallback } from 'react';
import { debounce } from 'lodash';
import classNames from 'classnames';
import { Input, Checkbox } from 'antd';
import { Search } from '@icon-park/react';
import { TitleWithHelp } from '../TitleWithHelp';
import { onLevelClick } from './useAnchor';
import { useHeightScroll } from './useHeightscroll';
import type { CustomField } from '../../hooks/useCustomSetting';

// 定义PREFIX_CLS常量
const PREFIX_CLS = 'custom';

import style from './style.module.less';

// 定义分组类型
interface GroupItem {
  id: string;
  groupName: string;
  children?: GroupItem[];
  fields?: CustomField[];
  [key: string]: any; // 允许其他属性
}

export interface ColGroupsProps {
  fields: CustomField[];
  // onFieldsChange: (newFields: CustomField[]) => void;
  onToggleFields: (fieldKeys: string[], checked: boolean) => void;
  maxLevel?: number;
}

// 根据 fields 数据构建分组树形结构
const buildGroupsFromFields = (fields: CustomField[]) => {
  console.log('wgr buildGroupsFromFields input fields:', fields);

  //用于和存储分组信息，放置重复创建
  const groupsMap = new Map<string, any>(); // Key: path string, e.g., "GroupA/GroupB"
  const rootNodes = new Map<string, any>(); // Use a map to store unique root nodes (groups or fields)

  for (const field of fields) {
    let parentGroup: any | null = null;

    //无分组的信息直接添加到根节点
    if (field.groups.length === 0) {
      rootNodes.set(field.key || field.field || `field-${Math.random()}`, field);
      continue;
    }

    const pathSegments: string[] = [];//存储当前分组路径
    for (let i = 0; i < field.groups.length; i++) {
      const groupInfo = field.groups[i];
      pathSegments.push(groupInfo.title);
      const pathKey = pathSegments.join('/');

      let currentGroup = groupsMap.get(pathKey);
      if (!currentGroup) {
        currentGroup = {
          ...groupInfo,
          id: pathKey, // The unique ID is the path
          groupName: groupInfo.title, // Ensure groupName is set for rendering
          children: [],
          fields: [],
          isFakeGroup: false, // 标记是否为假分组
        };
        groupsMap.set(pathKey, currentGroup);

        if (parentGroup) {
          parentGroup.children.push(currentGroup);
        } else {
          rootNodes.set(pathKey, currentGroup);
        }
      }
      parentGroup = currentGroup;
    }

    // 如果只有一级分组，添加"全选"假二级分组
    if (field.groups.length === 1 && parentGroup) {
      const fakeGroupPath = `${parentGroup.id}/全选`;
      let fakeGroup = groupsMap.get(fakeGroupPath);

      if (!fakeGroup) {
        fakeGroup = {
          id: fakeGroupPath,
          groupName: '全选',
          children: [],
          fields: [],
          isFakeGroup: true, // 标记为假分组，左侧目录不显示
        };
        groupsMap.set(fakeGroupPath, fakeGroup);
        parentGroup.children.push(fakeGroup);
      }

      // 将字段添加到假二级分组
      fakeGroup.fields.push(field);
    } else if (parentGroup) {
      // 正常情况：将字段添加到其直接父分组
      parentGroup.fields.push(field);
    }
  }

  const result = Array.from(rootNodes.values());
  console.log('wgr buildGroupsFromFields result:', result);
  return result;
};

export default function ColGroups({ fields, onToggleFields, maxLevel = 3 }: ColGroupsProps): React.ReactElement {
  const [searchText, setSearchText] = useState<string>('');
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const rightFieldsRef = useRef<HTMLDivElement>(null);
  const groupElementsRef = useRef<Map<string, HTMLElement>>(new Map());

  const groupedFields = useMemo(() => buildGroupsFromFields(fields), [fields]);

  // 添加一个标志，用于判断是否是点击触发的滚动
  const isClickScrollingRef = useRef(false);

  const { registerGroupElement, updateLeftPanelHighlight } = useHeightScroll({
    rightFieldsRef,
    groupElementsRef,
    isClickScrollingRef,
    activeGroupId,
    setActiveGroupId,
  });

  const filterGroups = useMemo(() => {
    if (!searchText) {
      return groupedFields;
    }

    const filterFn = (groups: (CustomField | GroupItem)[]): (CustomField | GroupItem)[] =>
      groups
        .map(item => {
          // 检查是否是 GroupItem 类型
          if ('groupName' in item) {
            // 优先匹配字段
            const filteredFields = Array.isArray(item.fields)
              ? item.fields.filter((f: CustomField) =>
                (typeof f.title === 'function' ? f.title() : f.title).toLowerCase().includes(searchText.toLowerCase()),
              )
              : [];

            // 如果子分组存在，则递归过滤
            const filteredChildren = item.children ? filterFn(item.children) : [];

            // 如果当前分组的名称匹配，或者有匹配的子字段/子分组，则保留
            if (
              (item.groupName && item.groupName.toLowerCase().includes(searchText.toLowerCase())) ||
              filteredFields.length > 0 ||
              filteredChildren.length > 0
            ) {
              return { ...item, fields: filteredFields, children: filteredChildren } as GroupItem;
            }

            return undefined;
          } else {
            // 处理 CustomField 类型
            const title = typeof item.title === 'function' ? item.title() : item.title;
            if (title.toLowerCase().includes(searchText.toLowerCase())) {
              return item;
            }
            return undefined;
          }
        })
        .filter((item): item is CustomField | GroupItem => !!item);

    return filterFn(groupedFields);
  }, [groupedFields, searchText]);

  const handleOnSearchChange = useCallback(
    (val: string) => {
      setSearchText(val ? val.trim() : '');
    },
    [],
  );

  const handleChangeCheckbox = (fieldKeys: string[], checked: boolean) => {
    console.log('wgr ColGroup handleChangeCheckbox called with:', { fieldKeys, checked });
    console.log(
      'wgr ColGroup handleChangeCheckbox current fields state:',
      fields.map(f => ({ field: f.field, checked: f.checked })),
    );

    // 使用来自Hook的切换函数
    onToggleFields(fieldKeys, checked);
    console.log('wgr ColGroup handleChangeCheckbox completed');
  };

  const renderTree = useMemo(() => {
    const genRender = (groups: (CustomField | GroupItem)[], level: number): {
      groupsRender: React.ReactNode[];
      fieldsRender: React.ReactNode[];
    } => {
      // 添加日志查看输入数据
      console.log(`wgr ColGroup genRender called with level ${level}:`, groups);

      const groupsRenderArr = [];
      const fiedlsRenderArr = [];

      //遍历字段是否存在分组，存在则添加到分组内，不存在则添加到fiedlsRenderArr
      for (const item of groups) {
        //第一种情况： 如果是字段类型，跳过分组渲染
        if ('field' in item) {
          fiedlsRenderArr.push(
            <div
              className={classNames(style.fieldItem, `level-${level}`)}
              key={item.field || `field-${level}-${fiedlsRenderArr.length}`}
            >
              <Checkbox
                checked={item.checked || false}
                disabled={item.disabled || false}
                onChange={(e) => handleChangeCheckbox([item.field], e.target.checked)}
              >
                {item.title ? (typeof item.title === 'function' ? item.title() : item.title) : ''}
              </Checkbox>
            </div>
          );
          continue;
        }
        //第二种情况： 如果是分组类型，递归渲染子分组
        const childrenRender = Array.isArray(item.children) ? genRender(item.children, level + 1) : null;

        //计算分组内字段的选择情况，渲染二级标题，给fiedlsRenderArr消费
        let checkBoxGroupRender;
        if (Array.isArray(item.fields) && item.fields.length > 0) {
          const allFieldsKey = item.fields
            .filter((f: CustomField) => f && !f.disabled)
            .map((f: CustomField) => f.field);
          const checkedFields = allFieldsKey.filter((key: string) => fields.find(f => f && f.field === key)?.checked);
          const isAllCheck = checkedFields.length === allFieldsKey.length && allFieldsKey.length > 0;
          const isSomeCheck = checkedFields.length > 0;
          const indeterminate = !isAllCheck && isSomeCheck;
          checkBoxGroupRender = (
            <Checkbox
              onChange={() => handleChangeCheckbox(allFieldsKey, !isAllCheck)}
              indeterminate={indeterminate}
              checked={isAllCheck}
            >
              {item.description ? (
                <TitleWithHelp title={item.groupName} help={item.description} placement="top" />
              ) : (
                item.groupName
              )}
            </Checkbox>
          );
        }

        // 左侧分组树渲染 - 只显示真实分组
        if (!item.isFakeGroup) {
          //左侧分组目录
          groupsRenderArr.push(
            <div
              className={classNames(style.item, `level-${level}`, {
                'active-l1': groupsRenderArr.length === 0 && level === 1,
              })}
              data-id={item.id || ''}
              key={item.id || `group-${level}-${groupsRenderArr.length}`}
              onClick={event => {
                console.log('wgr ColGroup onLevelClick called with:', { itemId: item.id, event });
                // 立即设置活动分组，提供即时反馈
                setActiveGroupId(item.id?.toString() || '');
                // 设置点击滚动标志
                isClickScrollingRef.current = true;
                onLevelClick(event, item.id);
              }}
            >
              <div className={style.itemChild}> {item.groupName}</div>
              {/* 渲染子分组 */}
              {childrenRender?.groupsRender}
            </div>,
          );
        }
        //右侧字段check栏
        fiedlsRenderArr.push(
          <div
            className={classNames(style.item, `level-${level}`, `group-${item.id || ''} max-level-${maxLevel}`)}
            key={item.id || `group-${level}-${groupsRenderArr.length}`}
            ref={el => registerGroupElement(item.id?.toString() || '', el)}
          >
            <div>{checkBoxGroupRender ?? item.groupName}</div>
            {childrenRender?.fieldsRender}
            {Array.isArray(item.fields) ? (
              <div className={style.fieldsWrap} key={`${item.id}-fields`}>
                {item.fields.map((field: CustomField) => (
                  <Checkbox
                    key={field.field}
                    onChange={() => handleChangeCheckbox([field.field], !field.checked)}
                    checked={field.checked}
                    disabled={field.disabled}
                  >
                    {field.tips ? (
                      <TitleWithHelp
                        key={field.field}
                        title={typeof field.title === 'function' ? field.title() : field.title}
                        help={field.tips}
                        placement="top"
                      />
                    ) : typeof field.title === 'function' ? (
                      field.title()
                    ) : (
                      field.title
                    )}
                  </Checkbox>
                ))}
              </div>
            ) : null}
          </div>,
        );
      }

      return {
        groupsRender: groupsRenderArr,
        fieldsRender: fiedlsRenderArr,
      };
    };

    const render = genRender(filterGroups, 1);
    return {
      groups: render.groupsRender,
      fields: render.fieldsRender,
    };
  }, [filterGroups, fields, handleChangeCheckbox, updateLeftPanelHighlight, maxLevel, registerGroupElement]);

  const searchPrepend = (
    <div className={style.searchPrepend}>
      <Search theme="outline" size="14" fill="#333" />
    </div>
  );

  // 添加日志查看左侧分组树渲染的数据结构
  console.log('wgr ColGroup renderTree.groups data structure:', renderTree.groups);
  console.log('wgr ColGroup filterGroups data structure:', filterGroups);

  return (
    <div className={style.colGroups}>
      <div className={style.search}>
        <Input
          size="large"
          addonBefore={searchPrepend}
          placeholder="请搜索"
          onChange={debounce((e) => handleOnSearchChange(e.target.value), 300)}
        />
      </div>

      <div className={style.groupsContent}>
        <div className={style.leftGroups}>
          <div className={style.groupsTree}>{renderTree.groups}</div>
        </div>
        <div className={classNames(`${PREFIX_CLS}right-fields`, style.rightFields)} ref={rightFieldsRef}>
          <div className={style.fieldsTree}>{renderTree.fields}</div>
        </div>
      </div>
    </div>
  );
}