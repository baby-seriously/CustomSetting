import type { UserField } from '../types/CustomPreferred';

// 静态的用户字段数据，用于演示
export const staticUserFields: UserField[] = [
  // 顺序打乱，测试排序
  {
    key: 'cpc',
    selected: false,
  },
  {
    key: 'impressions',
    selected: true,
  },
  // selected: false，测试用户偏好保留
  // systemFields 中不存在的 key，测试过滤
  {
    key: 'unbuliva',
    selected: true,
  },
  // 基础指标
  {
    key: 'cost',
    selected: true,
  },
  // 缺少 cpm, cpc，测试新增
  {    key: 'deep_conversion_cost',    selected: true,  },
  {
    key: 'conversion_cost',
    selected: true,
  },
  {
    key: 'conversion_rate',
    selected: true,
  },
  {
    key: 'conversions',
    selected: true,
  },
  {
    key: 'form_submission',
    selected: true,
  },
  {
    key: 'phone_click',
    selected: true,
  },
  {
    key: 'map_search',
    selected: true,
  },
];