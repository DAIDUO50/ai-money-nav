import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Divider } from "@nextui-org/react";

import { AppConfig } from "@/lib/config";
import { Link } from "@/navigation";

import Container from "./container";
import Logo from "./logo";

export default function Footer({ className }: { className?: string }) {
  const t = useTranslations("footer");

  return (
    <Container className={clsx(className, "pb-8 sm:pb-12")}>
      <Divider className="mt-12 sm:mt-20 mb-6" />
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex-1 flex flex-col">
          <Logo className="text-lg sm:text-xl mb-3" />
          <div className="font-normal text-primary text-sm sm:text-base mb-2 leading-relaxed">
            {t("slogan")} — {t("tagline")}
          </div>
          <div className="font-normal text-primary text-xs sm:text-sm">
            © {new Date().getFullYear()} {AppConfig.siteName}. {t("allRightsReserved")}
          </div>
        </div>
        <div className="flex-1 flex justify-start sm:justify-end font-semibold text-primary text-sm sm:text-base">
          <div className="flex-grow-0 flex-shrink-0 basis-40 flex flex-col gap-2 text-left sm:text-right">
            <Link href="/#featured">{t("featured")}</Link>
            <Link href="/#latest">{t("latestSubmit")}</Link>
            <Link href="/categories">{t("allCategories")}</Link>
            <Link href="/submit">{t("submitATool")}</Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
