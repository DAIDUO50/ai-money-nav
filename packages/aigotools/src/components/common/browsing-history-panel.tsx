"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BarChart3, RotateCcw } from "lucide-react";
import { getViewStats } from "@/lib/browsing-history";

export default function ViewStatsPanel() {
  const t = useTranslations("dashboard");
  const [stats, setStats] = useState({ today: 0, month: 0 });
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // 初始化加载
    setStats(getViewStats());

    // 监听 storage 变化（多标签页同步）
    const handleStorage = () => {
      setStats(getViewStats());
    };
    window.addEventListener("storage", handleStorage);

    // 监听 visibilitychange（页面切换回来时刷新）
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        setStats(getViewStats());
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="mt-auto border-t border-default-200 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between px-3 mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm text-default-600 hover:text-default-800"
        >
          <BarChart3 size={14} />
          <span className="font-medium">{t("viewStats")}</span>
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-default-400 hover:text-default-600 transition-colors"
        >
          {isOpen ? "▲" : "▼"}
        </button>
      </div>

      {/* Stats */}
      {isOpen && (
        <div className="px-3 py-4">
          <div className="grid grid-cols-2 gap-3">
            {/* 今日浏览 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.today}</div>
              <div className="text-xs text-blue-500 mt-1">今日浏览</div>
            </div>
            
            {/* 本月浏览 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.month}</div>
              <div className="text-xs text-purple-500 mt-1">本月浏览</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}