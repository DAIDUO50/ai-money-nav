"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Pagination,
  Button,
} from "@nextui-org/react";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { Plus, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import SiteEdit from "@/components/site-manage/site-edit";
import SiteOperation from "@/components/site-manage/site-operation";

import { SearchParams, managerSearchSites, getCategoryById } from "@/lib/actions";
import Loading from "@/components/common/loading";
import EmptyImage from "@/components/search/empty-image";
import { Site } from "@/models/site";
import { Category } from "@/models/category";
import { createTemplateSite } from "@/lib/create-template-site";

interface CategorySitesTableProps {
  categoryId: string;
}

export default function CategorySitesTable({ categoryId }: CategorySitesTableProps) {
  const t = useTranslations("siteManage");
  const router = useRouter();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [searchResult, setSearchResult] = useState({
    sites: [] as Site[],
    count: 0,
    totalPage: 0,
  });
  const [site, setSite] = useState<Site | undefined>(undefined);

  const [loading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    page: 1,
    size: 15,
    category: categoryId,
  });

  // Load category info
  useEffect(() => {
    const loadCategory = async () => {
      try {
        const cat = await getCategoryById(categoryId);
        setCategory(cat);
      } catch (error) {
        console.log("Failed to load category", error);
      }
    };
    loadCategory();
  }, [categoryId]);

  const handleSearch = useCallback(async () => {
    if (loading) {
      return;
    }
    try {
      setIsLoading(true);

      const result = await managerSearchSites(searchParams);

      setSearchResult(result);
    } catch (error) {
      console.log(error);
      toast.error(t("failSearch"));
    } finally {
      setIsLoading(false);
    }
  }, [loading, searchParams, t]);

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleBack = () => {
    router.push("/dashboard/category-manage");
  };

  return (
    <div className="mt-4 relative py-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          size="sm"
          variant="light"
          startContent={<ArrowLeft size={16} />}
          onClick={handleBack}
        >
          返回分类列表
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">
            {category ? `${category.icon} ${category.name}` : "分类详情"}
          </h1>
          <p className="text-sm text-gray-500">
            分类ID: {categoryId}
          </p>
        </div>
        <Button
          size="sm"
          startContent={<Plus size={14} />}
          onClick={() => {
            const newSite = createTemplateSite();
            newSite.categories = [categoryId];
            setSite(newSite);
          }}
        >
          {t("new")}
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-end gap-4 mb-4">
        <Input
          className="w-96"
          placeholder={t("inputSearch")}
          size="sm"
          onChange={debounce(
            (e) =>
              setSearchParams({
                ...searchParams,
                search: e.target.value,
                page: 1,
              }),
            1000,
            {
              maxWait: 5000,
            }
          )}
        />
      </div>

      {/* Table */}
      <div className="mt-6 relative">
        <Table className="mt-6" shadow="sm">
          <TableHeader>
            <TableColumn>{t("siteName")}</TableColumn>
            <TableColumn>{t("url")}</TableColumn>
            <TableColumn>{t("pricing")}</TableColumn>
            <TableColumn>{t("rating")}</TableColumn>
            <TableColumn maxWidth={160}>{t("updatedAt")}</TableColumn>
            <TableColumn maxWidth={160}>{t("operation")}</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="w-full flex py-60 items-center justify-center">
                <EmptyImage className="dark:invert" />
              </div>
            }
          >
            {searchResult.sites.map((site) => (
              <TableRow key={site._id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {site.icon && (
                      <img
                        src={site.icon}
                        alt=""
                        className="w-5 h-5 rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <span className="font-medium">{site.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:underline truncate max-w-xs block"
                  >
                    {site.url}
                  </a>
                </TableCell>
                <TableCell>{site.pricingType || (site.pricings && site.pricings[0]) || '-'}</TableCell>
                <TableCell>{site.rating}</TableCell>
                <TableCell>
                  {dayjs(site.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
                <TableCell>
                  <SiteOperation
                    site={site}
                    handleSearch={handleSearch}
                    onEdit={() => setSite(site)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Loading isLoading={loading} />
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 px-4 gap-4">
        <div className="text-primary-400 text-sm flex-grow-0 flex-shrink-0 basis-48">
          Total {searchResult.count}
        </div>
        <div className="pr-48 flex-1 flex items-center justify-center">
          {searchResult.totalPage > 0 && (
            <Pagination
              showControls
              showShadow
              isDisabled={loading}
              page={searchParams.page}
              size="md"
              total={searchResult.totalPage}
              onChange={(page) => {
                setSearchParams({
                  ...searchParams,
                  page,
                });
              }}
            />
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <SiteEdit
        site={site}
        onClose={() => {
          setSite(undefined);
          handleSearch();
        }}
      />
    </div>
  );
}
