import dayjs from "dayjs";
import { Button, Divider, Image } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { ExternalLink, Navigation, Share2, Heart, BookmarkPlus, Star, Check } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

import VoteButton from "./vote-button";
import ListItem from "./list-item";
import SiteTags from "./site-tags";

import { Site } from "@/models/site";

export default function SiteDetail({ site }: { site: Site }) {
  const t = useTranslations("site");
  const rating = site.rating || 4.0;

  const getPricingColor = (pricingType: string) => {
    if (pricingType === "免费" || pricingType === "Free") {
      return "from-green-500 to-emerald-500";
    } else if (pricingType === "付费" || pricingType === "Paid") {
      return "from-purple-500 to-violet-500";
    }
    return "from-blue-500 to-cyan-500";
  };

  return (
    <div className="py-9">
      {/* Hero banner with gradient */}
      <div className="relative mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-violet-600/10 border border-purple-200/50">
        <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-r from-violet-500/20 to-pink-500/20 rounded-full blur-2xl -z-10" />
        
        <Link
          className="flex items-center justify-center cursor-pointer"
          href={site.url}
          target="_blank"
        >
          <h2
            className={clsx(
              "inline-flex relative gap-2 px-2 items-center justify-center text-center text-3xl leading-0 font-bold",
              "bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent",
              "after:content-[' '] after:overflow-hidden after:absolute after:-bottom-[1px] after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:w-0 hover:after:w-full after:transition-width"
            )}
          >
            <span>{site.name}</span>
            <ExternalLink size={22} strokeWidth={3} className="text-purple-500" />
          </h2>
        </Link>
        
        <div className="text-center mt-3 text-primary-500 font-medium text-sm">
          {dayjs(site.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
        </div>
        
        {/* Prominent pricing card */}
        <div className="flex justify-center mt-4">
          <div className={clsx(
            "inline-flex items-center gap-3 px-4 py-2 rounded-full text-white font-medium shadow-lg",
            "bg-gradient-to-r",
            getPricingColor(site.pricingType)
          )}>
            <span>{site.pricingType}</span>
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-white" />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Share buttons section */}
      <div className="flex justify-center gap-3 mb-8">
        <Button
          className="font-medium bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg hover:shadow-rose-500/25"
          radius="full"
          size="sm"
          startContent={<Heart size={16} />}
        >
          {t("favorite")}
        </Button>
        <Button
          className="font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/25"
          radius="full"
          size="sm"
          startContent={<Share2 size={16} />}
        >
          {t("share")}
        </Button>
        <Button
          className="font-medium bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:shadow-lg hover:shadow-purple-500/25"
          radius="full"
          size="sm"
          startContent={<BookmarkPlus size={16} />}
        >
          Bookmark
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap lg:flex-nowrap gap-6">
        <div className="flex-1 basis-full lg:basis-[30%]">
          <Image
            isZoomed
            alt={site.name}
            classNames={{
              wrapper: "w-full !max-w-full cursor-pointer",
              img: "w-full aspect-video object-fill rounded-xl",
            }}
            radius="sm"
            src={site.snapshot}
          />
          <SiteTags site={site} />
        </div>
        <div className="flex-1 basis-full lg:basis-[70%] text-base text-primary-700 font-normal">
          <div>{site.description}</div>
          {site.features.length > 0 && (
            <>
              <h3 className="my-6 font-bold text-2xl text-primary-800 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full" />
                {t("topFeatures")}
              </h3>
              <ol className="space-y-3">
                {site.features.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      {i + 1}
                    </div>
                    <ListItem>{item}</ListItem>
                  </li>
                ))}
              </ol>
            </>
          )}
          {site.usecases.length > 0 && (
            <>
              <h3 className="my-6 font-bold text-2xl text-primary-800 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-purple-600 to-violet-600 rounded-full" />
                {t("usecases")}
              </h3>
              <ol className="space-y-3">
                {site.usecases.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      {i + 1}
                    </div>
                    <ListItem>{item}</ListItem>
                  </li>
                ))}
              </ol>
            </>
          )}
          {site.links &&
            Object.values(site.links).filter(Boolean).length > 0 && (
              <>
                <h3 className="my-6 font-bold text-2xl text-primary-800 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-violet-600 to-pink-600 rounded-full" />
                  {t("links")}
                </h3>
                <ol className="space-y-2">
                  {site.links.login && (
                    <ListItem>
                      <Link
                        className="hover:underline text-purple-600 hover:text-purple-700"
                        href={site.links.login}
                        target="_blank"
                      >
                        {t("loginPage")}: {site.links.login}
                      </Link>
                    </ListItem>
                  )}
                  {site.links.register && (
                    <ListItem>
                      <Link
                        className="hover:underline text-purple-600 hover:text-purple-700"
                        href={site.links.register}
                        target="_blank"
                      >
                        {t("registerPage")}: {site.links.register}
                      </Link>
                    </ListItem>
                  )}
                  {site.links.documentation && (
                    <ListItem>
                      <Link
                        className="hover:underline text-purple-600 hover:text-purple-700"
                        href={site.links.documentation}
                        target="_blank"
                      >
                        {t("docPage")}: {site.links.documentation}
                      </Link>
                    </ListItem>
                  )}
                  {site.links.pricing && (
                    <ListItem>
                      <Link
                        className="hover:underline text-purple-600 hover:text-purple-700"
                        href={site.links.pricing}
                        target="_blank"
                      >
                        {t("pricingPage")}: {site.links.pricing}
                      </Link>
                    </ListItem>
                  )}
                </ol>
              </>
            )}
        </div>
      </div>
      <div className="mx-auto max-w-full w-[720px] gap-6">
        <Divider className="mt-12 mb-8 bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
        <div className="flex gap-6 items-center justify-center">
          <Link href={site.url} target="_blank">
            <Button
              className="w-56 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300"
              radius="full"
              size="lg"
            >
              <Navigation size={18} strokeWidth={3} />
              {t("visitSite")}
            </Button>
          </Link>
          <VoteButton site={site} />
        </div>
      </div>
    </div>
  );
}