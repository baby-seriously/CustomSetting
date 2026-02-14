import { forwardRef, useEffect, useRef, useCallback } from 'react';
import { useCustomFieldsManagement } from './hooks/useCustomFieldsManagement';
import { type CustomField } from './hooks/useCustomSetting';
import ColGroups from './components/ColGroup';
import ColSorter from './components/ColSorter';
import style from './style.module.less';

interface InnerProps {
  fields: CustomField[];
  onChange: (fields: CustomField[]) => void;
  maxSelectedCount?: number;
}

export const CustomsettingSettingInner = forwardRef<{}, InnerProps>(({ fields, onChange, maxSelectedCount = 16 }, ref) => {
  console.log('wgr CustomsettingSettingInner - fields:', fields.map(f => ({ field: f.field, checked: f.checked })));

  const isResettingRef = useRef(false);
  const initialFieldsRef = useRef<CustomField[]>([]);

  // 保存初始状态
  useEffect(() => {
    if (initialFieldsRef.current.length === 0) {
      initialFieldsRef.current = fields.map(f => ({ ...f }));
    }
  }, [fields]);

  // 使用自定义 Hook 管理字段状态和操作
  const {
    fields: managedFields,
    selectedFields,
    dragValues,
    fixedValues,
    handleFieldsChange,
    handleToggleFields,
    handleRemoveFields,
    handleReorderFields,
    handleResetFields,
  } = useCustomFieldsManagement({
    initialFields: fields,
    maxSelectedCount,
  });

  // 重置字段处理函数
  const handleReset = useCallback(() => {
    isResettingRef.current = true;
    handleResetFields();
    setTimeout(() => {
      isResettingRef.current = false;
      onChange(initialFieldsRef.current);
    }, 0);
  }, [handleResetFields, onChange]);

  // 当外部字段变化时更新内部状态
  useEffect(() => {
    if (!isResettingRef.current) {
      handleFieldsChange(fields);
    }
  }, [fields, handleFieldsChange]);

  // 当内部字段变化时通知外部
  useEffect(() => {
    if (!isResettingRef.current) {
      onChange(managedFields);
    }
  }, [managedFields, onChange]);

  return (
    <div className={style.content}>
      <ColGroups fields={managedFields} onToggleFields={handleToggleFields} />
      <ColSorter
        fields={managedFields}
        selectedFields={selectedFields}
        dragValues={dragValues}
        fixedValues={fixedValues}
        maxSelectedCount={16}
        onFieldsChange={handleFieldsChange}
        onRemoveFields={handleRemoveFields}
        onReorderFields={handleReorderFields}
        onReset={handleReset}
      />
    </div>
  );
});