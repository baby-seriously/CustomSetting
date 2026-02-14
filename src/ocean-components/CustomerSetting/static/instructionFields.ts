import type { SystemField } from '../types/CustomPreferred';

export const staticSystemFields: SystemField[] = [
  // A
  {
    key: 'a4',
    title: 'A-a4',
    defaultSelect: false,
    groups: [{ title: 'A' }, { title: 'A/a' }],
 
  },
  {
    key: 'a2',
    title: 'A-a2',
    defaultSelect: false,
    groups: [{ title: 'A', dragScope: true }, { title: 'A/a', dragScope: true }]
  },
  {
    key: 'b1',
    title: 'A-b1',
 
    defaultSelect: true,
    groups: [{ title: 'A' }, { title: 'A/a' }]
  },
  {
    key: 'a3',
    title: 'A-a3',
    defaultSelect: false,
    groups: [{ title: 'A' }, { title: 'A/a' }]
  },
  {
    key: 'a1',
    title: 'A-a1',
    defaultSelect: true,
   
    groups: [{ title: 'A' }, { title: 'A/a' }]
  },
  // 转化指标
  {
    key: 'a7',
    title: 'A-a7',
    defaultSelect: true,
    groups: [{ title: 'A' }, { title: 'A/a' }]
  },
  {
    key: 'a6',
    title: 'A-a6',
    defaultSelect: true,
    groups: [{ title: 'A' }, { title: 'A/a' }]
  },
  {
    key: 'a5',
    title: 'A-a5',
    defaultSelect: true,
    groups: [{ title: 'A' }, { title: 'A/a' }]
  },
  {
    key: 'c1',
    title: 'A-c1',
    defaultSelect: true,
    groups: [{ title: 'A' }, { title: 'A/a' }]
  },
  {
    key: 'd1',
    title: 'D-d1',
    defaultSelect: true,
    groups: [{ title: 'D' }, { title: 'D/d' }]
  },
  {
    key: 'd2',
    title: 'D-d2',
    defaultSelect: true,
    groups: [{ title: 'D' }, { title: 'D/d' }]
  },
  {
    key: 'f1',
    title: 'F-f1',
    defaultSelect: true,
    groups: [{ title: 'F' }, { title: 'F/f' }],
    onlineDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10天前上线
  },
  {
        key: 'e1',
    title: 'E-e1',
    defaultSelect: true,
    groups: [{ title: 'E' }, { title: 'E/e' }],
    fixed: "end",

  }
];