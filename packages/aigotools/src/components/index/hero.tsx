"use client";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Button } from "@nextui-org/react";
import { Istok_Web } from "next/font/google";
import { Sparkles, Rocket, Search } from "lucide-react";

import { Link } from "@/navigation";

const istokWeb = Istok_Web({
  subsets: ["latin"],
  weight: "700",
});

export default function Hero() {
  const t = useTranslations("index");

  return (
    <div className="relative mt-8 sm:mt-12 text-center px-2 sm:px-4 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-violet-600/10 -z-10" />
      
      {/* Floating AI-themed decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse -z-10" />
      <div className="absolute top-20 right-20 w-48 h-48 bg-gradient-to-r from-violet-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000 -z-10" />
      <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse delay-500 -z-10" />
      <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse delay-700 -z-10" />
      
      {/* Small floating circles */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-500/40 rounded-full animate-bounce delay-200 -z-10" />
      <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-purple-500/40 rounded-full animate-bounce delay-400 -z-10" />
      <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-violet-500/40 rounded-full animate-bounce delay-600 -z-10" />
      
      <h1
        className={clsx(
          istokWeb.className,
          "text-2xl sm:text-4xl md:text-5xl max-w-[900px] !leading-[1.3] mx-auto font-bold",
          "bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent",
        )}
      >
        {t("slogan")}
      </h1>
      <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-primary-500 max-w-[680px] mx-auto leading-relaxed">
        {t("subtitle")}
      </p>
      
      {/* CTA buttons with gradient and hover glow effects */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        <Link href="/search">
          <Button
            className="font-semibold w-full sm:w-auto min-w-[160px] bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300"
            radius="full"
            size="lg"
            startContent={<Sparkles size={18} />}
          >
            {t("exploreBtn")}
          </Button>
        </Link>
        <Link href="/#latest">
          <Button
            className="font-semibold w-full sm:w-auto min-w-[160px] border-2 border-purple-500/50 text-purple-600 hover:border-purple-600 hover:bg-purple-50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
            radius="full"
            size="lg"
            variant="bordered"
            startContent={<Rocket size={18} />}
          >
            {t("latestBtn")}
          </Button>
        </Link>
      </div>
      
      {/* Search hint */}
      <div className="mt-6 flex items-center justify-center gap-2 text-primary-400 text-sm">
        <Search size={16} className="text-purple-500" />
        <span>{t("searchPlaceholder")}</span>
      </div>
    </div>
  );
}