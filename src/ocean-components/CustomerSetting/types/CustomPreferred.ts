export interface SystemField{
   key: string;
 title: string | (() => string);
 defaultSelect?: boolean;
 ///能否跨组拖拽
 groups: { title: string; dragScope?: true }[];
 //hover文案
 tips?: string;
 //是否固定在左侧或右侧
 fixed?: 'start' | 'end';
 //用于标记是否是新增字段
 onlineDate?: string;
}
export interface UserField{
   key: string;
   selected: boolean;
}