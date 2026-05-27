"use client";

import { Site } from "@/models/site";
import { useRouter } from "@/navigation";

interface TrendingSectionProps {
  sites: Site[];
}

export default function TrendingSection({ sites }: TrendingSectionProps) {
  const router = useRouter();

  if (!sites || sites.length === 0) return null;

  return (
    <div className="mt-8 sm:mt-12">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🔥</span>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">热门趋势</h2>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-0.5 w-16 rounded-full" />
      </div>
      <div className="overflow-x-auto scrollbar-hide pb-2">
        <div className="flex gap-3 min-w-max">
          {sites.map((site, index) => (
            <div
              key={site._id as string}
              className="w-[200px] sm:w-[220px] flex-shrink-0 bg-primary-100 rounded-xl overflow-hidden cursor-pointer border border-transparent hover:border-purple-500/30 hover:shadow-lg transition-all duration-300 group"
              onClick={() => router.push(`/s/${site.siteKey}`)}
            >
              <div className="relative">
                <div className="w-full aspect-[16/10] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center">
                  {site.snapshot ? (
                    <img
                      src={site.snapshot}
                      alt={site.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <span className="text-3xl">{site.name.charAt(0)}</span>
                  )}
                </div>
                {index < 3 && (
                  <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold shadow">
                    {index + 1}
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-primary-800 truncate">{site.name}</h3>
                <p className="text-xs text-primary-400 mt-1 line-clamp-2">{site.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-primary-500">
                    👍 {site.voteCount || 0}
                  </span>
                  {site.pricingType && (
                    <span className={`text-xs px-2 py-0.5 rounded-full text-white ${
                      site.pricingType.includes("免费") ? "bg-green-500" : "bg-purple-500"
                    }`}>
                      {site.pricingType}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
