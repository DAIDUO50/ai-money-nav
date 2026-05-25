import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/common/container";
import SiteGroup from "@/components/common/sites-group";
import NavBar from "@/components/common/nav-bar";
import SiteDetail from "@/components/site/site-detail";
import { getSiteDetailByKey, getSiteMetadata } from "@/lib/actions";

export async function generateMetadata({
  params,
}: {
  params: { site: string; locale: string };
}): Promise<Metadata> {
  const site = await getSiteMetadata(params.site);

  return {
    title: `${site?.title || params.site}`,
    description: site?.description,
    keywords: site?.keywords,
  };
}

export default async function Page({ params }: { params: { site: string } }) {
  const t = await getTranslations("site");
  const site = await getSiteDetailByKey(params.site);

  // 站点不存在时显示友好提示
  if (!site) {
    return (
      <Container className="mt-4">
        <NavBar name={params.site} />
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-6">🔍</div>
          <h2 className="text-2xl font-bold text-default-700 mb-3">
            未找到该工具
          </h2>
          <p className="text-default-500 mb-8 max-w-md">
            抱歉，<strong className="text-primary-500">{params.site}</strong> 
            暂未收录。你可以尝试搜索其他 AI 工具，或者浏览我们的分类页面。
          </p>
          <div className="flex gap-3">
            <Link
              href="/search"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              搜索 AI 工具
            </Link>
            <Link
              href="/categories"
              className="px-6 py-2.5 bg-default-100 text-default-700 rounded-full font-medium hover:bg-default-200 transition-all"
            >
              浏览分类
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <NavBar name={site.site.name} />
      <SiteDetail site={site.site} />
      {site.suggests.length > 0 && (
        <SiteGroup sites={site.suggests} title={t("relatedTools")} />
      )}
    </Container>
  );
}
