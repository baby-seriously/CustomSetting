import type { SystemField, UserField } from '../types/CustomPreferred';

export type FieldInUse = SystemField & { selected?: boolean };

/** 获取字段分组的唯一标识 (sorted titles string) */
const getGroupIdentity = (field: SystemField | FieldInUse): string => {
 if (!field.groups || field.groups.length === 0) {
 return '[]';
 }
 const titles = field.groups.map(g => g.title).sort();
 return titles.join('-');
};

/** 在动态数组中找到分组的第一个字段 */
const findFirstFieldInGroup = (fields: FieldInUse[], groupIdentity: string): FieldInUse | undefined => {
 return fields.find(f => getGroupIdentity(f) === groupIdentity);
    };

/** 在 systemFields 中找到前一个不同分组字段 */
const findPreviousDifferentGroupField = (
 systemFields: SystemField[],
 targetField: SystemField,
): SystemField | undefined => {
 const targetGroupIdentity = getGroupIdentity(targetField);
 const targetIndex = systemFields.findIndex(f => f.key === targetField.key);
 if (targetIndex <= 0) return undefined;

 for (let i = targetIndex - 1; i >= 0; i--) {
 const current = systemFields[i];
 if (getGroupIdentity(current) !== targetGroupIdentity) {
 return current;
 }
 }
 return undefined;
};

/** 插入算法 */
const insertField = (currentFields: FieldInUse[], newField: FieldInUse, systemFields: SystemField[]): FieldInUse[] => {
 const result = [...currentFields];
 const targetGroupIdentity = getGroupIdentity(newField);
 //策略一：
 // 1) 已有分组：直接插在 user 中该分组的第一个元素位置
 const firstFieldInGroup = findFirstFieldInGroup(result, targetGroupIdentity);
 if (firstFieldInGroup) {
 const firstIndex = result.findIndex(f => f.key === firstFieldInGroup.key);
 return [...result.slice(0, firstIndex), newField, ...result.slice(firstIndex)];
 }
 //策略二：
 // 1) 全新分组：先判断是否在 systemFields 中处于开头
 const systemIndex = systemFields.findIndex(f => f.key === newField.key);
 if (systemIndex === 0) {
 return [newField, ...result];
 }

 // 2) 否则，取 systemFields 中前一个不同分组的分组信息，
 // 然后在 user 中从后往前找，插在该分组最后一个字段后面
 const anchorField = findPreviousDifferentGroupField(systemFields, newField);
 if (anchorField) {
 const anchorGroupIdentity = getGroupIdentity(anchorField);
 for (let i = result.length - 1; i >= 0; i--) {
 if (getGroupIdentity(result[i]) === anchorGroupIdentity) {
 return [...result.slice(0, i + 1), newField, ...result.slice(i + 1)];
 }
 }
 }

 // 找不到锚点或 user 中不存在该分组 → 插在最前面
 return [newField, ...result];
};

/** 主函数：diffFields */
export const diffFields = (systemFields: SystemField[], userFields: UserField[]): FieldInUse[] => {
  const systemFieldKeys = new Set(systemFields.map(f => f.key));

 // 过滤掉 user 中已经下架的字段
 const filteredUserFields: FieldInUse[] = userFields
 .filter(uf => systemFieldKeys.has(uf.key))
 .map(uf => {
 const sf = systemFields.find(s => s.key === uf.key)!;
 return { ...sf, selected: uf.selected ?? sf.defaultSelect ?? false };
 });

 const existingKeys = new Set(filteredUserFields.map(f => f.key));
 const newFields: FieldInUse[] = systemFields
 .filter(sf => !existingKeys.has(sf.key))
 .map(f => ({ ...f, selected: f.defaultSelect ?? false }));

 // 按顺序插入新增字段，动态数组 currentFields 保证连续新增字段顺序正确
 const finalFields = newFields.reduce((current, field) => {
 return insertField(current, field, systemFields);
 }, filteredUserFields);

 return finalFields;
};