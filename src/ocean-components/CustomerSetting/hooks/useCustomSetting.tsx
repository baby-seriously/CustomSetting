import { useState, useEffect, useCallback, type JSX } from 'react';
import type { MergeExclusive } from 'type-fest';
import { diffFields } from './diff';
import type { FieldInUse } from './diff';
import type { SystemField, UserField } from '../types/CustomPreferred';
// import { getUserFields } from '../api/getUserFields';
// import { saveUserFields } from '../api/saveUserFields';
import { CustomsettingSetting } from '../Customsetting';
export type UseCustomerSettingProps = MergeExclusive<
  //  { storageKey: string; systemFields: SystemField[] },
  //  { storageKey: string; getSystemFields: () => Promise<SystemField[]> }
  { storageKey: string; systemFields: SystemField[]; initialUserFields: UserField[]; maxSelectedCount?: number },
  { storageKey: string; getSystemFields: () => Promise<SystemField[]>; initialUserFields: UserField[]; maxSelectedCount?: number }

>;
export interface UseCustomerSettingReturn {
  fields: CustomField[]; // 用于UI渲染的字段
  loading: boolean;
  // save: () => Promise<void>;
  save: () => void; // 保存用户设置的方法
  updateFields: (newFields: CustomField[]) => void; // 更新字段状态的方法
  openCustomColumnsSetting: () => void; // 显示设置面板的方法
  renderCustomColumnsSetting: () => JSX.Element; // 渲染设置组件的函数
}

export interface CustomField extends SystemField {
  /**
  * 是否被用户勾选。
  * 决定左侧复选框状态和是否出现在右侧列表。
  * @from diff(system, user)
  */
  checked: boolean;

  /**
  * 在已选列表中的排序值。
  * 用于右侧列表的拖拽排序。
  * @from diff(system, user) or UI interaction
  */
  order: number;

  /**
  * 字段是否被禁用。
  * 决定左侧复选框是否可交互。
  * @derived from `fixed`
  */
  disabled: boolean;

  /**
  * 字段是否为新上线。
  * 用于在字段名旁显示 "NEW" 标识。
  * @derived from `onlineDate`
  */
  isNew: boolean;

  /**
  * 字段的唯一标识符 (兼容名)。
  * @alias for `key`
  */
  field: string;

  /**
  * 字段的显示名称 (兼容名)。
  * @alias for `title`
  */
  label: string;

  /**
  * 字段类型，用于业务逻辑判断（如指标数量限制）。
  * @from CustomerTableColItem
  */
  fieldType?: string;
}

const FIFTEEN_DAYS = 15 * 24 * 60 * 60 * 1000;

// 将 diff 结果转换为 UI 使用的 CustomField
const transformFields = (fields: FieldInUse[]): CustomField[] => {
  return fields.map((field, index) => ({
    ...field,
    checked: field.selected ?? field.defaultSelect ?? false,
    order: index, // 字段已经排好序了
    disabled: !!field.fixed,
    isNew: field.onlineDate ? new Date().getTime() - new Date(field.onlineDate).getTime() < FIFTEEN_DAYS : false,
    field: field.key,
    label: typeof field.title === 'function' ? field.title() : field.title,
    fieldType: 'customer',
  }));
};

export const useCustomerSetting = (props: UseCustomerSettingProps): UseCustomerSettingReturn => {
  console.log('wgr useCustomerSetting 初始化，props:', props);
  const { storageKey, maxSelectedCount = 16 } = props;
  const [systemFields, setSystemFields] = useState<SystemField[]>([]);
  const [fields, setFields] = useState<CustomField[]>([]);
  // 后续可能需要使用的状态，暂时注释
  // const [diffedFields, setDiffedFields] = useState<FieldInUse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visible, setVisible] = useState(false); // 内部管理设置面板可见性

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const systemFields =
        'getSystemFields' in props && props.getSystemFields
          ? await props.getSystemFields()
          : await Promise.resolve(props.systemFields);

      setSystemFields(systemFields);

      // 优先从localStorage中获取用户设置
      let userFields = props.initialUserFields;
      try {
        const storedData = localStorage.getItem(`wgr/customer/${storageKey}`);
        if (storedData) {
          userFields = JSON.parse(storedData);
          console.log('wgr 从localStorage获取用户设置:', userFields);
        }
      } catch (error) {
        console.error('Failed to get user fields from localStorage:', error);
        // 如果从localStorage获取失败，使用初始用户字段
        userFields = props.initialUserFields;
      }

      const calculatedDiffedFields = diffFields(systemFields, userFields);
      console.log('wgrdiffFields result:', calculatedDiffedFields);
      const customFields = transformFields(calculatedDiffedFields);
      setFields(customFields);
      // 后续可能需要使用的状态更新，暂时注释
      // setDiffedFields(calculatedDiffedFields);
    } catch (error) {
      console.error('Failed to diff fields:', error);
    } finally {
      setLoading(false);
    }

    console.log('wgr useCustomerSetting fetchData 完成，fields:', fields);
    console.log('wgr useCustomerSetting fetchData 完成，systemFields:', systemFields);
  }, [storageKey, props.getSystemFields, props.systemFields, props.initialUserFields]);

  useEffect(() => {
    console.log('wgr useCustomerSetting 调用 fetchData');
    fetchData();
  }, [fetchData]);


  //有checked为true的字段时，才会调用saveUserFields保存用户设置
  // const save = useCallback(async () => {
  //   setLoading(true);
  //   try {
  //     if (fields.some(field => field.checked)) {
  //       const userFields: UserField[] = fields
  //         .filter(field => field.checked)
  //         .map(field => ({
  //           key: field.key,
  //           selected: true,
  //         }));
  //       await saveUserFields(storageKey, userFields);
  //     }
  //   } catch (error) {
  //     console.error('Failed to save fields:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [storageKey, fields]);

  // 直接保存到localStorage的逻辑
  const save = useCallback(() => {
    try {
      // 保存所有字段的选择状态，而不仅仅是选中的字段
      const userFields: UserField[] = fields
        .map(field => ({
          key: field.key,
          selected: field.checked,
        }));
      // 直接保存到localStorage
      localStorage.setItem(`wgr/customer/${storageKey}`, JSON.stringify(userFields));
      console.log('wgr 直接保存到localStorage成功:', userFields);
    } catch (error) {
      console.error('Failed to save fields to localStorage:', error);
    }
  }, [storageKey, fields]);


  // 显示设置面板
  const openCustomColumnsSetting = useCallback(() => {
    setVisible(true);
  }, []);

  // 更新字段的方法 wgr真实没有
  const updateFields = useCallback((newFields: CustomField[]) => {
    setFields(newFields);
  }, []);

  // 渲染设置组件的函数
  const renderCustomColumnsSetting = () => (
    <CustomsettingSetting
      visible={visible}
      fields={fields}
      onChange={setFields}
      onCancel={() => setVisible(false)}
      onSave={async () => {
        await save();
        setVisible(false);
      }}
      maxSelectedCount={maxSelectedCount}
    />
  );

  return {
    fields,
    loading,
    save,
    updateFields,
    openCustomColumnsSetting,
    renderCustomColumnsSetting,
  };
};