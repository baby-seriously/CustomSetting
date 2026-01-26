import { useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

import style from './style.module.less';
// import { PREFIX_CLS } from '@/const/css';

export interface UseHeightScrollOptions {
 rightFieldsRef: React.RefObject<HTMLDivElement>;
 groupElementsRef: React.RefObject<Map<string, HTMLElement>>;
 isClickScrollingRef: React.RefObject<boolean>;
 activeGroupId: string | null;
 setActiveGroupId: (id: string | null) => void;
}

// 使用scrollIntoView将右侧内容滚动到对应分组
   export const scrollToGroup = (groupId: string, rightFieldsRef: React.RefObject<HTMLDivElement>) => {
 if (!rightFieldsRef.current) return;

 console.log('wgr useHeightscroll scrollToGroup called with:', { groupId });

 // 修改选择器，使用CSS.escape来正确处理特殊字符
 const escapedId = CSS.escape(groupId);
 const selector = `.group-${escapedId}`;
 const targetElement = rightFieldsRef.current.querySelector(selector);

 console.log('wgr useHeightscroll attempting to scroll to:', {
 groupId,
 escapedId,
 selector,
 elementFound: !!targetElement,
 elementPosition: targetElement ? targetElement.getBoundingClientRect() : null,
 });

 if (targetElement) {
 // 使用更精确的滚动选项
 targetElement.scrollIntoView({
 behavior: 'smooth',
 block: 'start', // 滚动到元素的顶部
 inline: 'nearest',
 });

 // 添加一个延迟检查，看滚动后元素位置
 setTimeout(() => {
 console.log('wgr useHeightscroll after scroll position:', {
 groupId,
 elementPosition: targetElement.getBoundingClientRect(),
 containerScrollTop: rightFieldsRef.current?.scrollTop,
 });
 }, 500);
 } else {
 console.warn('wgr useHeightscroll target element not found:', { groupId, selector });
 }
};

// 直接操作DOM，添加/移除高亮类名方法
export const updateLeftPanelHighlight = (groupId: string) => {
 console.log('wgr useHeightscroll updateLeftPanelHighlight called with:', { groupId });

 // 清除所有高亮
 const activeLevel1Dom = document.querySelector(`.${style.leftGroups} .active-l1`);
 if (activeLevel1Dom) {
 activeLevel1Dom.className = activeLevel1Dom.className.replace('active-l1', '');
 }

 const activeLevel2Dom = document.querySelector(`.${style.leftGroups} .active-l2`);
 if (activeLevel2Dom) {
 activeLevel2Dom.className = activeLevel2Dom.className.replace('active-l2', '');
 }

 // 设置新的高亮
 const pathSegments = groupId.split('/');

 if (pathSegments.length >= 1) {
 const level1Selector = `.${style.leftGroups} [data-id="${pathSegments[0]}"]`;
 const level1Element = document.querySelector(level1Selector);
 if (level1Element) {
 (level1Element as HTMLDivElement).className = `${(level1Element as HTMLDivElement).className} active-l1`;
 }
 }

 if (pathSegments.length >= 2) {
 const level2Selector = `.${style.leftGroups} [data-id="${groupId}"]`;
 const level2Element = document.querySelector(level2Selector);
 if (level2Element) {
 (level2Element as HTMLDivElement).className = `${(level2Element as HTMLDivElement).className} active-l2`;
 }
 }
};

// 处理滚动事件，更新左侧目录高亮
const handleScroll = (
 rightFieldsRef: React.RefObject<HTMLDivElement>,
 groupElementsRef: React.RefObject<Map<string, HTMLElement>>,
 isClickScrollingRef: React.RefObject<boolean>,
 activeGroupId: string | null,
 setActiveGroupId: (id: string | null) => void,
) => {
 if (!rightFieldsRef.current) return;

 const scrollTop = rightFieldsRef.current.scrollTop;

 // 添加日志
 console.log('wgr useHeightscroll handleScroll called:', {
 scrollTop,
 isClickScrolling: isClickScrollingRef.current,
 activeGroupId,
 });

 // 如果是点击触发的滚动，不进行高亮更新，避免与点击操作冲突
 if (isClickScrollingRef.current) {
 console.log('wgr useHeightscroll skipping highlight update during click scrolling');
 return;
 }

 // 获取所有分组元素
 const groupElements = Array.from(groupElementsRef.current.entries());

 let currentActiveGroupId: string | null = null;
 let minDistance = Infinity;

 for (const [groupId, element] of groupElements) {
 const rect = element.getBoundingClientRect();
const containerRect = rightFieldsRef.current?.getBoundingClientRect();

 // 计算元素顶部到容器顶部的距离
 const distanceFromTop = rect.top - containerRect.top;

 console.log('wgr useHeightscroll checking group:', {
 groupId,
 distanceFromTop,
 rect,
 containerRect,
 });

 if (distanceFromTop >= -50 && distanceFromTop < minDistance) {
 minDistance = distanceFromTop;
 currentActiveGroupId = groupId;
 }
 }

 console.log('wgr useHeightscroll handleScroll result:', {
 currentActiveGroupId,
 previousActiveGroupId: activeGroupId,
 willUpdate: currentActiveGroupId && currentActiveGroupId !== activeGroupId,
 });

 if (currentActiveGroupId && currentActiveGroupId !== activeGroupId) {
 setActiveGroupId(currentActiveGroupId);
 updateLeftPanelHighlight(currentActiveGroupId);
 }
};

// 自定义Hook：处理滚动高亮
    export const useHeightScroll = ({
 rightFieldsRef,
 groupElementsRef,
 isClickScrollingRef,
 activeGroupId,
 setActiveGroupId,
}: UseHeightScrollOptions) => {
 // 注册分组元素

 const registerGroupElement = useCallback(
  
 (groupId: string, element: HTMLElement | null) => {
 if (element) {
 groupElementsRef.current.set(groupId, element);
 } else {
 groupElementsRef.current.delete(groupId);
 }
 },
 [groupElementsRef],
 );

 // 滚动中间栏的时候对应高亮
 useEffect(() => {
 const debouncedHandleScroll = debounce(
 () => handleScroll(rightFieldsRef, groupElementsRef, isClickScrollingRef, activeGroupId, setActiveGroupId),
 100,
 );

 const rightFieldsElement = rightFieldsRef.current;

 if (rightFieldsElement) {
 rightFieldsElement.addEventListener('scroll', debouncedHandleScroll);
 // 初始调用一次，确保初始状态正确
 handleScroll(rightFieldsRef, groupElementsRef, isClickScrollingRef, activeGroupId, setActiveGroupId);
 }

 return () => {
 if (rightFieldsElement) {
 rightFieldsElement.removeEventListener('scroll', debouncedHandleScroll);
 }
 };
 }, [rightFieldsRef, groupElementsRef, isClickScrollingRef, activeGroupId, setActiveGroupId]);

 // 点击左侧目录滚动到对应分组
 useEffect(() => {
  
    const handleAnchorScrollComplete = (event: CustomEvent) => {
 const { groupId } = event.detail;
 console.log('wgr useHeightscroll received anchorScrollComplete event:', { event });

 // 设置活动分组ID
 setActiveGroupId(groupId);

 // 更新左侧面板高亮
 updateLeftPanelHighlight(groupId);

 // 重置点击滚动标志
 isClickScrollingRef.current = false;
 };

 // 添加事件监听
 document.addEventListener('anchorScrollComplete', handleAnchorScrollComplete as EventListener);

 // 清理函数
 return () => {
 document.removeEventListener('anchorScrollComplete', handleAnchorScrollComplete as EventListener);
 };
 }, [setActiveGroupId, isClickScrollingRef]);

 // 导出函数
 return {
 registerGroupElement,
 updateLeftPanelHighlight,
 scrollToGroup: (groupId: string) => scrollToGroup(groupId, rightFieldsRef),
 };
};