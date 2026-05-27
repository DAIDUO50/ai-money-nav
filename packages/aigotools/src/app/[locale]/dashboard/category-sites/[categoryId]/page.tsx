import CategorySitesTable from "@/components/category-manage/category-sites-table";

interface CategorySitesPageProps {
  params: {
    categoryId: string;
    locale: string;
  };
}

export default function CategorySitesPage({ params }: CategorySitesPageProps) {
  return <CategorySitesTable categoryId={params.categoryId} />;
}
