import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import Container from "@/components/common/container";
import NavBar from "@/components/common/nav-bar";
import CategoriesList from "@/components/categories/categories-list";
import { searchSites, getAllCategories } from "@/lib/actions";
import SiteGroup from "@/components/common/sites-group";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "categories",
  });

  return {
    title: t("metadata.title"),
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: { c?: string };
}) {
  const t = await getTranslations("categories");
  const categoryName = searchParams.c;

  // 没有选择分类时，显示全部分类列表
  if (!categoryName) {
    return (
      <Container>
        <NavBar name={t("metadata.title")} />
        <CategoriesList />
      </Container>
    );
  }

  // 获取所有分类，找到当前分类
  const categories = await getAllCategories();
  const category = categories.find((c: any) => c.name === categoryName);

  if (!category) {
    notFound();
  }

  // 获取该分类下的工具（第1页）
  const { sites } = await searchSites({
    search: "",
    category: categoryName,
    page: 1,
  });

  return (
    <Container>
      <NavBar name={category.name} />
      <div className="mt-8 mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </h2>
      </div>
      {sites.length > 0 ? (
        <SiteGroup sites={sites} title="" className="mt-4" />
      ) : (
        <div className="text-center my-16 text-default-400">
          {t("noTools")}
        </div>
      )}
    </Container>
  );
}
