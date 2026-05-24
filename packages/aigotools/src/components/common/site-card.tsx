"use client";
import clsx from "clsx";
import { Image } from "@nextui-org/react";
import { ExternalLink, ThumbsUpIcon, Bot, Heart, Star } from "lucide-react";
import { useState } from "react";

import { Site } from "@/models/site";
import { useRouter } from "@/navigation";

export default function SiteCard({ site }: { site: Site }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const rating = site.rating || 4.0;

  const getPricingColor = (pricingType: string) => {
    if (pricingType === "免费" || pricingType === "Free") {
      return "bg-gradient-to-r from-green-500 to-emerald-500";
    } else if (pricingType === "付费" || pricingType === "Paid") {
      return "bg-gradient-to-r from-purple-500 to-violet-500";
    }
    return "bg-gradient-to-r from-blue-500 to-cyan-500";
  };

  return (
    <div
      key={site._id as string}
      className="group w-full shadow-medium hover:shadow-xl transition-all duration-300 bg-primary-100 rounded-xl overflow-hidden cursor-pointer border border-transparent hover:border-purple-500/30 hover:scale-[1.02] hover:shadow-purple-500/10"
      onClick={() => {
        router.push(`/s/${site.siteKey}`);
      }}
    >
      <div className="relative">
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
        {/* Pricing badge */}
        <span
          className={clsx(
            "absolute top-3 right-3 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg",
            getPricingColor(site.pricingType)
          )}
        >
          {site.pricingType}
        </span>
        {/* Favorite button */}
        <button
          className={clsx(
            "absolute top-3 left-3 p-2 rounded-full transition-all duration-300",
            "bg-white/80 backdrop-blur-sm hover:bg-white shadow-md",
            isFavorite && "text-red-500"
          )}
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
        >
          <Heart
            size={16}
            className={isFavorite ? "fill-red-500" : ""}
          />
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {site.icon ? (
                <img
                  src={site.icon.startsWith("http") ? site.icon : `https://www.google.com/s2/favicons?domain=${site.url}&sz=64`}
                  alt={site.name}
                  className="w-6 h-6 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden"); }}
                />
              ) : null}
              <Bot size={24} className={site.icon ? "text-primary-600 hidden" : "text-purple-500"} />
            </div>
            <div
              className={clsx(
                "flex items-center text-primary-800 font-semibold gap-2 relative",
                "after:content-[' '] after:overflow-hidden after:absolute after:-bottom-[1px] after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:w-0 group-hover:after:w-full after:transition-width"
              )}
            >
              <h3 className="text-lg">{site.name}</h3>
              <ExternalLink size={16} className="text-purple-500" />
            </div>
          </div>
        </div>
        <div className="mt-2 text-primary-400 text-sm overflow-hidden text-ellipsis line-clamp-2">
          {site.description}
        </div>
        
        {/* Rating and feature tags */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Star rating */}
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-primary-600">{rating.toFixed(1)}</span>
            </div>
            {/* Category tags */}
            {site.categories?.slice(0, 1)?.map((category, index) => (
              <span
                key={index}
                className="text-tiny font-medium py-[1px] px-2 rounded-[4px] bg-gradient-to-r from-blue-600 to-purple-600 text-white inline-block"
              >
                {category}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {site.voteCount > 0 && (
              <div className="flex items-center text-purple-500 gap-1">
                <ThumbsUpIcon size={13} />
                <span className="text-sm">{site.voteCount}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Feature tags row */}
        {site.features && site.features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {site.features.slice(0, 3).map((feature, i) => (
              <span
                key={i}
                className="text-tiny font-medium py-[2px] px-2 rounded-full bg-primary-500/10 text-primary-600 inline-block"
              >
                {feature}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}