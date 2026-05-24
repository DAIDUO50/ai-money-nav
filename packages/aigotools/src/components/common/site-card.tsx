"use client";
import clsx from "clsx";
import { Image } from "@nextui-org/react";
import { ExternalLink, ThumbsUpIcon, Bot } from "lucide-react";

import { Site } from "@/models/site";
import { useRouter } from "@/navigation";

export default function SiteCard({ site }: { site: Site }) {
  const router = useRouter();

  return (
    <div
      key={site._id as string}
      className="group w-full shadow-medium hover:shadow-large transition-all bg-primary-100 rounded-md overflow-hidden cursor-pointer"
      onClick={() => {
        router.push(`/s/${site.siteKey}`);
      }}
    >
      <Image
        isZoomed
        alt={site.name}
        classNames={{
          wrapper: "w-full !max-w-full",
          img: "w-full aspect-video object-fill",
        }}
        radius="none"
        src={site.snapshot}
      />
      <div className="p-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {site.icon ? (
                <img
                  src={site.icon.startsWith("http") ? site.icon : `https://www.google.com/s2/favicons?domain=${site.url}&sz=64`}
                  alt={site.name}
                  className="w-6 h-6 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden"); }}
                />
              ) : null}
              <Bot size={24} className={site.icon ? "text-primary-600 hidden" : "text-gray-400"} />
            </div>
            <div
              className={clsx(
                "flex items-center text-primary-800 font-semibold gap-2 relative",
                "after:content-[' '] after:overflow-hidden after:absolute after:-bottom-[1px] after:left-0 after:h-[2px] after:bg-primary-900 after:w-0 group-hover:after:w-full after:transition-width"
              )}
            >
              <h3 className="text-lg">{site.name}</h3>
              <ExternalLink size={16} />
            </div>
          </div>
          {site.subCategory && (
            <span className="text-tiny font-medium py-[2px] px-2.5 rounded-full bg-primary-500/10 text-primary-600 inline-block flex-shrink-0">
              {site.subCategory}
            </span>
          )}
        </div>
        <div className="mt-2 text-primary-400 text-sm overflow-hidden text-ellipsis line-clamp-2">
          {site.description}
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {site.categories?.slice(0, 1)?.map((category, index) => (
              <span
                key={index}
                className="text-tiny font-medium py-[1px] px-2 rounded-[4px] bg-primary-700 text-primary-200 inline-block"
              >
                {category}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {site.voteCount > 0 && (
              <div className="flex items-center text-primary-500 gap-1">
                <ThumbsUpIcon size={13} />
                <span className="text-sm">{site.voteCount}</span>
              </div>
            )}
            <span className="text-primary-600 text-nowrap text-tiny font-medium">
              {site.pricingType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
