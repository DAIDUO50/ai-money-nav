import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { LayoutDashboard, Globe, Tags, FileCheck, Flame } from "lucide-react";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  const cards = [
    {
      title: t("homeManage"),
      description: t("homeManageDesc"),
      href: "/dashboard/home-manage",
      icon: Flame,
      color: "bg-orange-500",
    },
    {
      title: t("siteManage"),
      description: t("siteManageDesc"),
      href: "/dashboard/site-manage",
      icon: Globe,
      color: "bg-blue-500",
    },
    {
      title: t("categoryManage"),
      description: t("categoryManageDesc"),
      href: "/dashboard/category-manage",
      icon: Tags,
      color: "bg-green-500",
    },
    {
      title: t("reviewManage"),
      description: t("reviewManageDesc"),
      href: "/dashboard/review-manage",
      icon: FileCheck,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard size={28} className="text-primary-500" />
        <h1 className="text-2xl font-bold">{t("title")}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group block p-6 rounded-xl border border-default-200 bg-default-50 hover:bg-default-100 hover:shadow-lg transition-all duration-200"
          >
            <div
              className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}
            >
              <card.icon size={24} className="text-white" />
            </div>
            <h2 className="text-lg font-semibold mb-2 group-hover:text-primary-500 transition-colors">
              {card.title}
            </h2>
            <p className="text-sm text-default-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
