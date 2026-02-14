import { useState, useCallback, useMemo } from 'react';
import type { CustomField } from './useCustomSetting';

interface UseCustomFieldsManagementProps {
 initialFields: CustomField[];
 maxSelectedCount?: number;
 minSelectedCount?: number;
}

export function useCustomFieldsManagement({
 initialFields,
 maxSelectedCount,
 minSelectedCount,
}: UseCustomFieldsManagementProps) {
 // 管理字段状态
 const [fields, setFields] = useState<CustomField[]>(initialFields);

 // 计算已选中的字段
 const selectedFields = useMemo(() => {
 return fields.filter(f => f.checked || f.fixed || f.disabled).sort((a, b) => a.order - b.order);
 }, [fields]);

 // 计算可拖拽的字段和固定字段
 const { dragValues, fixedValues } = useMemo(() => {
 const dragValues = selectedFields.filter(item => !item.disabled && !item.fixed);
 const fixedValues = selectedFields.filter(item => item.disabled || item.fixed);
 return { dragValues, fixedValues };
 }, [selectedFields]);

 // 处理字段选择变化
 const handleFieldsChange = useCallback(
 (newFields: CustomField[]) => {
 console.log('wgr handleFieldsChange called with:', newFields.map(f => ({ field: f.field, checked: f.checked })));

 // 验证最大选中数量
 if (maxSelectedCount) {
 const selectedCount = newFields.filter(f => f.checked || f.fixed || f.disabled).length;
 if (selectedCount > maxSelectedCount) {
 // 可以添加错误提示
 console.error(`wgr handleFieldsChange validation failed: 最多可选择${maxSelectedCount}个字段，当前选择了${selectedCount}个`);
 return;
 }
 }

 // 验证最小选中数量
 if (minSelectedCount) {
 const selectedCount = newFields.filter(f => f.checked || f.fixed || f.disabled).length;
 if (selectedCount < minSelectedCount) {
 // 可以添加错误提示
 console.error(`wgr handleFieldsChange validation failed: 最少需要选择${minSelectedCount}个字段，当前选择了${selectedCount}个`);
 return;
 }
 }

 console.log('wgr handleFieldsChange validation passed, calling setFields', newFields.map(f => ({ field: f.field, checked: f.checked })));
 setFields(newFields);
 console.log('wgr handleFieldsChange completed');
 },
 [maxSelectedCount, minSelectedCount],
 );

 // 处理字段选中/取消选中
 const handleToggleFields = useCallback(
 (fieldKeys: string[], checked: boolean) => {
 console.log('wgr handleToggleFields called with:', { fieldKeys, checked });
 console.log('wgr handleToggleFields current fields state:', fields.map(f => ({ field: f.field, checked: f.checked })));

 const newFields = fields.map(field => {
 if (fieldKeys.includes(field.field)) {
 return { ...field, checked };
 }
 return field;
 });

 console.log('wgr handleToggleFields new fields state after toggle:', newFields.map(f => ({ field: f.field, checked: f.checked })));
 handleFieldsChange(newFields);
 console.log('wgr handleToggleFields completed');
 },
 [fields, handleFieldsChange],
 );

 // 处理字段移除
 const handleRemoveFields = useCallback(
 (fieldKeys: string[]) => {
 console.log('wgr handleRemoveFields called with:', fieldKeys);
 console.log('wgr handleRemoveFields current fields state:', fields.map(f => ({ field: f.field, checked: f.checked })));

 const newFields = fields.map(field => {
 if (fieldKeys.includes(field.field) && !field.fixed && !field.disabled) {
 return { ...field, checked: false };
 }
 return field;
 });

 console.log('wgr handleRemoveFields new fields state after removal:', newFields.map(f => ({ field: f.field, checked: f.checked })));
 handleFieldsChange(newFields);
 console.log('wgr handleRemoveFields completed');
 },
 [fields, handleFieldsChange],
 );

 // 处理字段重排序
 const handleReorderFields = useCallback(
 (sourceIndex: number, destinationIndex: number) => {
 console.log('wgr handleReorderFields called with:', { sourceIndex, destinationIndex });
 console.log('wgr handleReorderFields current dragValues:', dragValues.map(f => ({ field: f.field, order: f.order })));

 const newDragValues = Array.from(dragValues);
 const [removed] = newDragValues.splice(sourceIndex, 1);
 newDragValues.splice(destinationIndex, 0, removed);

 const newSelectedKeys = [...fixedValues, ...newDragValues].map(f => f.field);

 const newFields = fields.map(field => {
 const index = newSelectedKeys.indexOf(field.field);
 if (index > -1) {
 return { ...field, checked: true, order: index };
 }
 return field;
 });

 console.log('wgr handleReorderFields new fields state after reorder:', newFields.map(f => ({ field: f.field, checked: f.checked, order: f.order })));
 handleFieldsChange(newFields);
 console.log('wgr handleReorderFields completed');
 },
 [fields, dragValues, fixedValues, handleFieldsChange],
 );

 // 重置字段
 const handleResetFields = useCallback(() => {

 // 深拷贝 initialFields 以确保状态更新
 const resetFields = initialFields.map(field => ({ ...field }));
 setFields(resetFields);
 console.log('wgr handleResetFields completed');
 }, [initialFields]);

 return {
 fields,
 selectedFields,
 dragValues,
 fixedValues,
 handleFieldsChange,
 handleToggleFields,
 handleRemoveFields,
 handleReorderFields,
 handleResetFields,
 };
}