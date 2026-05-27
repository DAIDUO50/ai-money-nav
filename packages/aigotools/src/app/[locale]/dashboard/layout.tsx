"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { LayoutDashboard, Globe, Tags, FileCheck } from "lucide-react";
import ViewStatsPanel from "@/components/common/browsing-history-panel";

import { Flame, Star, Clock } from "lucide-react";

const navItems = [
  { key: "homeManage", href: "/dashboard/home-manage", icon: LayoutDashboard },
  { key: "siteManage", href: "/dashboard/site-manage", icon: Globe },
  { key: "categoryManage", href: "/dashboard/category-manage", icon: Tags },
  { key: "reviewManage", href: "/dashboard/review-manage", icon: FileCheck },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("dashboard");
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-default-200 bg-default-50 p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2 px-3 py-4 mb-2">
          <LayoutDashboard size={20} className="text-primary-500" />
          <span className="font-bold text-sm">{t("title")}</span>
        </div>
        {navItems.map((item) => {
          const isActive = pathname.includes(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-primary-100 text-primary-600 font-medium"
                  : "text-default-600 hover:bg-default-100"
              }`}
            >
              <item.icon size={16} />
              {t(item.key)}
            </Link>
          );
        })}

        {/* 浏览统计面板 - 固定在底部 */}
        <div className="mt-auto pt-4">
          <ViewStatsPanel />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}