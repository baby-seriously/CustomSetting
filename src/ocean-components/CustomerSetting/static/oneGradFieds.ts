import type { SystemField } from '../types/CustomPreferred';

// 静态的系统字段数据，用于演示
export const staticSystemFields: SystemField[] = [
  // 基础指标
  {
    key: 'impressions',
    title: '可用余额',
    defaultSelect: true,
    groups: [{ title: '余额明细' }  ],
  },
  {
    key: 'clicks',
    title: '通用可用余额',
    defaultSelect: true,
    groups: [{ title: '余额明细', dragScope: true }],
    tips: '用户当前可用的通用余额'
  },
  {
    key: 'cost',
    title: '花费',
    defaultSelect: true,
    groups: [{ title: '基础指标' }],
    tips: '广告总花费'
  },
  {
    key: 'cpc',
    title: '点击成本',
    defaultSelect: false,
    groups: [{ title: '基础指标' }],
    tips: '单次点击的平均成本'
  },
  {
    key: 'cpm',
    title: '千次展示成本',
    defaultSelect: true,
    

    groups: [{ title: '基础指标' }],
    tips: '广告每展示1000次的成本'
  },
  // 转化指标
  {
    key: 'conversions',
    title: '转化数',
    defaultSelect: false,
    groups: [{ title: '基础指标' }],
    tips: '用户完成转化的次数'
  },
  {
    key: 'conversion_rate',
    title: '转化率',
  
    defaultSelect: false,
    groups: [{ title: '基础指标' }],
    tips: '转化数与点击数的比率'
  },
  {
    key: 'conversion_cost',
    title: '转化成本',
    defaultSelect: true,
    groups: [{ title: '基础指标' }],
    tips: '单次转化的平均成本'
  },
  // 互动指标
  {
    key: 'phone_click',
    title: '电话点击',
    defaultSelect: true,
    groups: [{ title: '基础指标' }],
    tips: '用户点击电话号码的次数'
  },
  {
    key: 'map_search',
    title: '地图搜索',
    defaultSelect: true,
    fixed: 'end',
    groups: [{ title: '互动指标' }],
    tips: '用户在地图中搜索的次数'
  },
  {
    key: 'form_submission',
    title: '表单提交',
    fixed: 'end',
    defaultSelect: true,
    groups: [{ title: '互动指标' }],
    tips: '用户提交表单的次数'
  },
  // 深度转化
  {
    key: 'deep_conversion_cost',
    title: '备款余额',
    defaultSelect: true,
    groups: [{ title: '操作' }],
    tips: '单次深度转化的平均成本',
    onlineDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10天前上线
  },
    {
    key: 'deep_conn_cost',
    title: '总备款',
    defaultSelect: true,
    groups: [{ title: '操作' }],
    tips: '单次深度转化的平均成本',
    onlineDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10天前上线
  }

];