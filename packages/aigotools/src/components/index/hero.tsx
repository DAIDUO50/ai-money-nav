import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Button } from "@nextui-org/react";
import { Istok_Web } from "next/font/google";

import { Link } from "@/navigation";

const istokWeb = Istok_Web({
  subsets: ["latin"],
  weight: "700",
});

export default function Hero() {
  const t = useTranslations("index");

  return (
    <div className="mt-8 sm:mt-12 text-center px-2 sm:px-4">
      <h1
        className={clsx(
          istokWeb.className,
          "text-2xl sm:text-4xl md:text-5xl max-w-[900px] !leading-[1.3] mx-auto font-bold text-primary-800",
        )}
      >
        {t("slogan")}
      </h1>
      <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-primary-500 max-w-[680px] mx-auto leading-relaxed">
        {t("subtitle")}
      </p>
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        <Link href="/search">
          <Button
            className="font-semibold w-full sm:w-auto min-w-[160px]"
            color="primary"
            radius="full"
            size="lg"
          >
            {t("exploreBtn")}
          </Button>
        </Link>
        <Link href="/#latest">
          <Button
            className="font-semibold w-full sm:w-auto min-w-[160px]"
            radius="full"
            size="lg"
            variant="bordered"
          >
            {t("latestBtn")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
