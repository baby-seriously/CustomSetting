import type { UserField } from '../types/CustomPreferred';

// 模拟保存用户字段的API
export async function saveUserFields(storageKey: string, fields: UserField[]): Promise<void> {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 模拟保存到localStorage或后端API
  try {
    localStorage.setItem(`wgr/customer/${storageKey}`, JSON.stringify(fields));
    console.log('User fields saved successfully:', { storageKey, fieldsCount: fields.length });
  } catch (error) {
    console.error('Failed to save user fields:', error);
    throw new Error('Failed to save user fields');
  }
}