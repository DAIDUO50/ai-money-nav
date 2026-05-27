"use client";
import clsx from "clsx";
import { ExternalLink, ThumbsUpIcon, Bot, Heart, Star, ImageIcon } from "lucide-react";
import { useState } from "react";

import { Site } from "@/models/site";
import { useRouter } from "@/navigation";
import { getSiteIconUrl } from "@/lib/site-icon";

export default function SiteCard({ site }: { site: Site }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgError, setImgError] = useState(false);
  const rating = site.rating || 4.0;
  const voteCount = site.voteCount || 0;

  const getHeatBadge = () => {
    if (voteCount > 500) return { emoji: "🔥", label: "爆火" };
    if (voteCount > 100) return { emoji: "⬆️", label: "热门" };
    if (voteCount > 20) return { emoji: "👍", label: "推荐" };
    return null;
  };

  const heatBadge = getHeatBadge();

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
      {!imgError && getValidSnapshotUrl(site) ? (
        <img
          alt={site.name}
          className="w-full aspect-[16/10] object-cover"
          src={getValidSnapshotUrl(site)}
          onError={(e) => {
            setImgError(true);
            (e.target as HTMLImageElement).style.display = 'none';
          }}
          loading="lazy"
        />
      ) : null}
      {(imgError || !getValidSnapshotUrl(site)) && <SnapshotFallback name={site.name} />}
        {/* Pricing badge */}
        <span
          className={clsx(
            "absolute top-3 right-3 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg",
            getPricingColor(site.pricingType)
          )}
        >
          {site.pricingType}
        </span>
        {/* Heat badge */}
        {heatBadge && (
          <span className="absolute top-3 right-[calc(100%-7rem)] text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg bg-gradient-to-r from-orange-500 to-red-500">
            {heatBadge.emoji} {heatBadge.label}
          </span>
        )}
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
              <SiteIcon site={site} />
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
        <div className="mt-2 text-primary-400 text-sm overflow-hidden text-ellipsis line-clamp-3">
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
        {/* Visit button on hover */}
        <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="text-sm font-medium text-purple-600 flex items-center gap-1 hover:text-purple-800"
            onClick={(e) => {
              e.stopPropagation();
              const targetUrl = site.url || '';
              if (targetUrl) {
                window.open(targetUrl, '_blank', 'noopener,noreferrer');
              }
            }}
          >
            访问 <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Get a valid snapshot URL, fallback to gradient placeholder */
function getValidSnapshotUrl(site: Site): string {
  const snapshot = site.snapshot;
  if (!snapshot) return "";
  // Skip known placeholder services that may be blocked/slow
  if (snapshot.includes("placehold.co") || snapshot.includes("via.placeholder")) {
    return "";
  }
  // Use thum.io screenshot - with error fallback via onError handler in img tag
  if (snapshot.includes("thum.io")) {
    // Return the URL - onError will show fallback if it fails
    return snapshot;
  }
  return snapshot;
}

/** Fallback component when snapshot image fails to load */
function SnapshotFallback({ name }: { name: string }) {
  return (
    <div className="w-full aspect-video bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center border-b border-gray-100">
      <div className="text-center px-4">
        <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Bot size={28} className="text-white" />
        </div>
        <span className="text-sm text-primary-500 font-medium">{name}</span>
      </div>
    </div>
  );
}

/** Site icon with Iconify and favicon fallback */
function SiteIcon({ site }: { site: Site }) {
  const [iconError, setIconError] = useState(false);

  const iconSrc = getSiteIconUrl(site.icon, site.url);

  // No valid icon or error - show default bot icon
  if (!iconSrc || iconError) {
    return <Bot size={24} className="text-purple-500" />;
  }

  return (
    <img
      src={iconSrc}
      alt={site.name}
      className="w-6 h-6 object-contain"
      onError={() => setIconError(true)}
      loading="lazy"
    />
  );
}