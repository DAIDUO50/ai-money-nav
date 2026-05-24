import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getFeaturedSites, getLatestSites } from "@/lib/actions";

import Container from "@/components/common/container";
import NavBar from "@/components/common/nav-bar";
import InfiniteSearch from "@/components/search/infinite-search";
import SiteGroup from "@/components/common/sites-group";

export async function generateMetadata({
  params,
}: {
  params: { site: string; locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "search",
  });

  return {
    title: t("metadata.title"),
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: {
    s: string;
    c: string;
  };
}) {
  const rawCategory = searchParams["c"] || "";
  const rawSearch = searchParams["s"] || "";
  const category = decodeURIComponent(rawCategory.toString());
  const search = decodeURIComponent(rawSearch.toString());

  // 有搜索词或分类时，使用搜索组件；否则显示热门/最新工具
  const hasQuery = search || category;

  // 预取热门和最新工具数据（仅首页展示用）
  const [featuredSites, latestSites] = hasQuery
    ? [[], []]
    : await Promise.all([getFeaturedSites(12), getLatestSites(12)]);

  return (
    <Container>
      <NavBar name={[category, search].filter(Boolean)} />
      {/* 搜索框始终显示 */}
      <div className="mt-6 sm:mt-12">
        <InfiniteSearch showSearchBox={true} />
      </div>
      {/* 无搜索条件时，显示热门推荐 */}
      {!hasQuery && (
        <>
              <SiteGroup
                id="featured"
                sites={featuredSites}
                title="热门推荐"
                className="mt-8"
              />
              <SiteGroup
                id="latest"
                sites={latestSites}
                title="最新收录"
                className="mt-8"
              />
            </>
      )}
    </Container>
  );
}
