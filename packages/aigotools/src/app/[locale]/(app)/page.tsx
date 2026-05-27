import { getTranslations } from "next-intl/server";

import Container from "@/components/common/container";
import Hero from "@/components/index/hero";
import Search from "@/components/index/search";
import SiteGroup from "@/components/common/sites-group";
import StatsBar from "@/components/index/stats-bar";
import CategoryNav from "@/components/index/category-nav";
import TrendingSection from "@/components/index/trending-section";
import { getFeaturedSites, getLatestSites, getTrendingSites, getSiteStats, getAllCategories } from "@/lib/actions";

export default async function Page() {
  const t = await getTranslations("index");
  const [featuredSites, latestSites, trendingSites, stats, categories] = await Promise.all([
    getFeaturedSites(),
    getLatestSites(),
    getTrendingSites(12),
    getSiteStats(),
    getAllCategories(),
  ]);

  const parentCategories = (categories || []).filter((c: any) => !c.parent);

  return (
    <>
      <Container>
        <Hero />
        <Search />
        <StatsBar stats={stats} />
        <CategoryNav categories={parentCategories} />
        <TrendingSection sites={trendingSites} />
        <SiteGroup id="featured" sites={featuredSites} title={t("featured")} />
        <SiteGroup id="latest" sites={latestSites} title={t("latest")} />
      </Container>
    </>
  );
}
