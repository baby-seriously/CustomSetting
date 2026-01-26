import { useImperativeHandle, forwardRef, useEffect } from 'react';
import { Spin } from 'antd';
import { useCustomerSetting, type CustomField } from './hooks/useCustomSetting';
import { useCustomFieldsManagement } from './hooks/useCustomFieldsManagement';
import ColGroups from './components/ColGroup';
import ColSorter from './components/ColSorter';
import style from './style.module.less';

type InnerProps = Parameters<typeof useCustomerSetting>[0];

export interface CustomsettingInnerRef {
  onSave: () => Promise<void>;
  getValue: () => CustomField[];
}

export const CustomsettingSettingInner = forwardRef<CustomsettingInnerRef, InnerProps>((props, ref) => {
  // 从 useCustomerSetting hook 获取字段
  const { fields: customFields, loading, save } = useCustomerSetting(props);

  // 使用自定义 Hook 管理字段状态和操作
  const {
    fields,
    selectedFields,
    dragValues,
    fixedValues,
    handleFieldsChange,
    handleToggleFields,
    handleRemoveFields,
    handleReorderFields,
    handleResetFields,
  } = useCustomFieldsManagement({
    initialFields: customFields,
    maxSelectedCount: 16, // 最多选择16个字段
  });

  // 当系统字段变化时更新内部状态，但只在初始化时更新
  useEffect(() => {
    if (fields.length === 0 && customFields.length > 0) {
      handleFieldsChange(customFields);
    }
  }, [customFields, handleFieldsChange, fields.length]);

  // 暴露方法给父组件
  useImperativeHandle(
    ref,
    () => ({
      onSave: async () => {
        // 保存当前字段状态
        return save();
      },
      getValue: () => fields,
    }),
    [save, fields],
  );

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className={style.content}>
      <ColGroups fields={fields} onToggleFields={handleToggleFields} />
      <ColSorter
        fields={fields}
        selectedFields={selectedFields}
        dragValues={dragValues}
        fixedValues={fixedValues}
        maxSelectedCount={16}
        onFieldsChange={handleFieldsChange}
        onRemoveFields={handleRemoveFields}
        onReorderFields={handleReorderFields}
        onReset={handleResetFields}
      />
    </div>
  );
});