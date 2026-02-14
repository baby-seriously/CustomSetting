import React from 'react';

// 定义PREFIX_CLS常量
const PREFIX_CLS = 'custom';

import style from './style.module.less';

// 使用锚点
export const onLevelClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string | number) => {
 event.stopPropagation();
 const { target } = event;
 // 一级dom
 const { parentNode } = target as HTMLDivElement;

 // 添加日志

 // level-1 active
 const activeLevel1Dom = document.querySelector(`.${style.leftGroups} .active-l1`);
 if (activeLevel1Dom) {
 activeLevel1Dom.className = activeLevel1Dom.className.replace('active-l1', '');
 }
 if ((parentNode as HTMLDivElement).className.includes('level-1')) {
 (parentNode as HTMLDivElement).className = `${(parentNode as HTMLDivElement).className} active-l1`;
 }

 const activeLevel2Dom = document.querySelector(`.${style.leftGroups} .active-l2`);
 if (activeLevel2Dom) {
 activeLevel2Dom.className = activeLevel2Dom.className.replace('active-l2', '');
 }

 if ((parentNode as HTMLDivElement).className.includes('level-2')) {
 const level1Dom = (parentNode as HTMLDivElement).parentNode;
 (level1Dom as HTMLDivElement).className = `${(level1Dom as HTMLDivElement).className} active-l1`;
 // level-2 active
 if (parentNode) {
 (parentNode as HTMLDivElement).className = `${(parentNode as HTMLDivElement).className} active-l2`;
 }
 }
 const rightDom = document.querySelector(`.${PREFIX_CLS}right-fields`);
 if (rightDom) {
 const escapedId = CSS.escape(id.toString());
 const selector = `.group-${escapedId}`;
 const targetElement = rightDom.querySelector(selector);


 if (targetElement) {
 targetElement.scrollIntoView({
 behavior: 'smooth',
 block: 'start', // 滚动到元素的顶部
 inline: 'nearest',
 });

 setTimeout(() => {
 console.log('wgr useAnchor after scroll position:', {
 id: id.toString(),
 elementPosition: targetElement.getBoundingClientRect(),
 containerScrollTop: (rightDom as HTMLElement).scrollTop,
 });

 // 触发自定义事件，通知滚动已完成
 const scrollCompleteEvent = new CustomEvent('anchorScrollComplete', {
 detail: { groupId: id.toString() },
 });
 document.dispatchEvent(scrollCompleteEvent);
 }, 500);
 } else {
 console.warn('wgr useAnchor target element not found:', { id: id.toString(), selector });

 // 尝试查找所有可能的匹配元素
 const allPossibleElements = Array.from(rightDom.querySelectorAll('[class*="group-"]'));
 console.log(
 'wgr useAnchor all group elements:',
 allPossibleElements.map(el => ({
 className: el.className,
 dataId: el.getAttribute('data-id'),
 })),
 );
 }
 }
};