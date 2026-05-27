"use client";
import { Istok_Web } from "next/font/google";
import clsx from "clsx";
import { useTranslations } from "next-intl";

import { Site } from "@/models/site";
import Container from "@/components/common/container";
import { Link } from "@/navigation";

import SiteCard from "./site-card";

const istokWeb = Istok_Web({
  subsets: ["latin"],
  weight: "700",
});

export default function SiteGroup({
  title,
  sites,
  id,
  category,
  className,
}: {
  id?: string;
  title: String;
  sites: Array<Site>;
  category?: string;
  className?: string;
}) {
  const t = useTranslations("categories");

  if (!sites.length) {
    return null;
  }

  return (
    <Container className={clsx("mt-8 sm:mt-12 md:mt-16", className)} id={id}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className={clsx(istokWeb.className, "text-xl sm:text-2xl font-bold tracking-tight")}>
            {title}
          </h2>
          {/* Gradient underline */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-0.5 w-16 rounded-full mt-2" />
        </div>
        {category && (
          <Link 
            href={`/search?c=${encodeURIComponent(category)}`}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
          >
            {t("viewMore")} →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
        {sites.map((site) => {
          return <SiteCard key={site._id} site={site} />;
        })}
      </div>
    </Container>
  );
}