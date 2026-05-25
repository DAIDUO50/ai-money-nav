"use client";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button, Spinner } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { TicketPlus } from "lucide-react";
import { useEffect } from "react";

import EmptyImage from "./empty-image";

import Search from "@/components/index/search";
import { searchSites } from "@/lib/actions";
import SiteGroup from "@/components/common/sites-group";
import { Site } from "@/models/site";

export default function InfiniteSearch({ showSearchBox = false }: { showSearchBox?: boolean }) {
  const searchParams = useSearchParams();
  const search = decodeURIComponent(searchParams.get("s") || "");
  const category = decodeURIComponent(searchParams.get("c") || "");
  const t = useTranslations("search");

  // Filter states
  const [pricingFilter, setPricingFilter] = useState<"all" | "free" | "paid">("all");
  const [ratingFilter, setRatingFilter] = useState<number>(0);

  // Pricing filter buttons
  const pricingFilters = [
    { key: "all" as const, label: t("filterAll") },
    { key: "free" as const, label: t("filterFree") },
    { key: "paid" as const, label: t("filterPaid") },
  ];

  // Rating filter buttons  
  const ratingFilters = [
    { key: 0, label: t("filterAll") },
    { key: 4, label: t("filterRating4") },
    { key: 3, label: t("filterRating3") },
    { key: 2, label: t("filterRating2") },
  ];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["search-sites", search, category, pricingFilter, ratingFilter],
    queryFn: async ({ pageParam }) => {
      return await searchSites({ search, page: pageParam, category, pricing: pricingFilter, rating: ratingFilter });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNext) {
        return lastPage.page + 1;
      }
    },
    throwOnError(error) {
      console.log(error);
      toast.error("loadFailed");

      return false;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch({});
  }, [search, refetch, category, pricingFilter, ratingFilter]);

  const sites =
    data?.pages.reduce((t, c) => t.concat(c.sites), [] as Site[]) || [];

  const totalCount = data?.pages[0]?.total || sites.length;

  return (
    <>
      {showSearchBox && (
        <Search category={category} className="sm:mt-12" defaultSearch={search} />
      )}
      
      {/* Filter Chips */}
      <div className="max-w-4xl mx-auto px-4 mt-6 mb-4">
        {/* Pricing Filter */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-sm text-default-500 mr-2 self-center">{t("pricing")}:</span>
          {pricingFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setPricingFilter(filter.key)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                pricingFilter === filter.key
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                  : "bg-default-100 text-default-600 hover:bg-default-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        {/* Rating Filter */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-default-500 mr-2 self-center">{t("rating")}:</span>
          {ratingFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setRatingFilter(filter.key)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                ratingFilter === filter.key
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                  : "bg-default-100 text-default-600 hover:bg-default-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Result count */}
      {search || category ? (
        <div className="max-w-4xl mx-auto px-4 mt-4 mb-2 text-sm text-default-500">
          {t("resultCount", { count: totalCount })}
        </div>
      ) : null}
      
      <SiteGroup sites={sites} title={search || category ? t("result") : ""} />
      <div className="flex justify-center mt-8">
        {isFetching || isFetchingNextPage ? (
          <Spinner className="my-24" />
        ) : hasNextPage ? (
          <Button
            className="font-semibold"
            color="primary"
            size="sm"
            startContent={<TicketPlus size={16} />}
            onClick={() => fetchNextPage()}
          >
            {t("loadMore")}
          </Button>
        ) : sites.length <= 0 ? (
          <div className="text-center my-16">
            <EmptyImage className="dark:invert" />
            <div className="mt-6 font-medium">{t("empty")}</div>
          </div>
        ) : null}
      </div>
    </>
  );
}
