"use client";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { Home } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/navigation";

export default function NavBar({ name }: { name: string | string[] }) {
  const t = useTranslations("site");

  return (
    <Breadcrumbs itemClasses={{ item: "text-primary-400 text-sm sm:text-base" }}>
      <BreadcrumbItem>
        <Link className="flex items-center gap-1" href="/">
          <Home size={16} /> <span>{t("home")}</span>
        </Link>
      </BreadcrumbItem>
      {(Array.isArray(name) ? name : [name]).map((n, i) => (
        <BreadcrumbItem key={i}>{n}</BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}
