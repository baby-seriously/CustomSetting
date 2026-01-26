import type { UserField } from '../types/CustomPreferred';

// 模拟获取用户字段的API
export async function getUserFields(storageKey: string): Promise<UserField[]> {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 模拟从localStorage或后端API获取用户保存的字段配置
  try {
    const savedFields = localStorage.getItem(`wgr/customer/${storageKey}`);
    if (savedFields) {
      return JSON.parse(savedFields);
    }
  } catch (error) {
    console.error('Failed to get user fields from storage:', error);
  }
  
  // 如果没有保存的配置，返回空数组
  return [];
}