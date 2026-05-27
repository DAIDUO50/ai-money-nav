import { getTranslations } from "next-intl/server";
import { Flame, Star, Clock } from "lucide-react";
import TrendingManage from "@/components/home-manage/trending-manage";
import FeaturedManage from "@/components/home-manage/featured-manage";
import LatestManage from "@/components/home-manage/latest-manage";

export default async function HomeManagePage() {
  const t = await getTranslations("dashboard");

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Flame size={24} className="text-orange-500" />
        <h1 className="text-xl font-bold">{t("homeManage")}</h1>
      </div>

      {/* Tabs for each section */}
      <div className="space-y-8">
        {/* Trending Section */}
        <section className="bg-default-50 rounded-xl border border-default-200 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-default-200">
            <Flame size={18} className="text-orange-500" />
            <h2 className="font-semibold text-primary-800">{t("trendingManage")}</h2>
            <span className="text-xs text-default-400 ml-2">{t("trendingManageDesc")}</span>
          </div>
          <div className="p-4">
            <TrendingManage />
          </div>
        </section>

        {/* Featured Section */}
        <section className="bg-default-50 rounded-xl border border-default-200 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-b border-default-200">
            <Star size={18} className="text-yellow-500" />
            <h2 className="font-semibold text-primary-800">{t("featuredManage")}</h2>
            <span className="text-xs text-default-400 ml-2">{t("featuredManageDesc")}</span>
          </div>
          <div className="p-4">
            <FeaturedManage />
          </div>
        </section>

        {/* Latest Section */}
        <section className="bg-default-50 rounded-xl border border-default-200 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b border-default-200">
            <Clock size={18} className="text-blue-500" />
            <h2 className="font-semibold text-primary-800">{t("latestManage")}</h2>
            <span className="text-xs text-default-400 ml-2">{t("latestManageDesc")}</span>
          </div>
          <div className="p-4">
            <LatestManage />
          </div>
        </section>
      </div>
    </div>
  );
}
