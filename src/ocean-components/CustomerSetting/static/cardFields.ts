import type { SystemField } from '../types/CustomPreferred';
export const staticSystemFields: SystemField[] = [
  {
    key: 'time',
    title: '实时数据',
    defaultSelect: true,
    groups: [{ title: '数据', dragScope: true }],
    tips: '用户当前实时数据'
  },
    {
    key: 'mast',
    title: '数据排名',
    defaultSelect: true,
    fixed: 'end',
    groups: [{ title: '数据' }],
  },
      {
    key: 'custm',
    title: '平台动态卡片',
    defaultSelect: true,
    groups: [{ title: '投放' }],
  },
      {
    key: 'possession',
    title: '流水指标',
    defaultSelect: true,
    groups: [{ title: '财务' }],
  },
      {
    key: 'debt',
    title: '平台授信',
    defaultSelect: true,
    groups: [{ title: '财务' }],
  },

      {
    key: 'deadline',
    title: '临期待办事项',
    defaultSelect: true,
    groups: [{ title: '待办' }],
  },

      {
    key: 'delay',
    title: '逾期待办事项',
    fixed: 'end',
    groups: [{ title: '待办' }],
  },





];