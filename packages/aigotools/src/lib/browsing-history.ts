"use client";

/**
 * 浏览量统计 - localStorage 存储
 */

const TODAY_KEY = "aigotools_stats_today";
const MONTH_KEY = "aigotools_stats_month";

function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function getMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * 记录一次浏览（增加计数）
 */
export function recordPageView() {
  if (typeof window === "undefined") return;
  
  try {
    // 今天的计数
    const todayData = localStorage.getItem(TODAY_KEY);
    const todayObj = todayData ? JSON.parse(todayData) : { date: getTodayKey(), count: 0 };
    
    // 检查是否需要重置（日期变了）
    if (todayObj.date !== getTodayKey()) {
      todayObj.date = getTodayKey();
      todayObj.count = 0;
    }
    todayObj.count += 1;
    localStorage.setItem(TODAY_KEY, JSON.stringify(todayObj));
    
    // 本月的计数
    const monthData = localStorage.getItem(MONTH_KEY);
    const monthObj = monthData ? JSON.parse(monthData) : { month: getMonthKey(), count: 0 };
    
    // 检查是否需要重置（月份变了）
    if (monthObj.month !== getMonthKey()) {
      monthObj.month = getMonthKey();
      monthObj.count = 0;
    }
    monthObj.count += 1;
    localStorage.setItem(MONTH_KEY, JSON.stringify(monthObj));
    
  } catch (e) {
    console.warn("Failed to record page view:", e);
  }
}

/**
 * 获取浏览统计
 */
export function getViewStats(): { today: number; month: number } {
  if (typeof window === "undefined") return { today: 0, month: 0 };
  
  try {
    // 今天的计数
    const todayData = localStorage.getItem(TODAY_KEY);
    if (todayData) {
      const todayObj = JSON.parse(todayData);
      if (todayObj.date === getTodayKey()) {
        // 有效数据
      } else {
        // 日期已过期，清零
        return { today: 0, month: getMonthCount() };
      }
      return { today: todayObj.count, month: getMonthCount() };
    }
  } catch (e) {
    console.warn("Failed to get today stats:", e);
  }
  
  return { today: 0, month: getMonthCount() };
}

function getMonthCount(): number {
  try {
    const monthData = localStorage.getItem(MONTH_KEY);
    if (monthData) {
      const monthObj = JSON.parse(monthData);
      if (monthObj.month === getMonthKey()) {
        return monthObj.count;
      }
    }
  } catch (e) {
    // ignore
  }
  return 0;
}

/**
 * 重置计数（用于测试）
 */
export function resetViewStats() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TODAY_KEY);
  localStorage.removeItem(MONTH_KEY);
}