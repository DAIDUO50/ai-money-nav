"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Flame, GripVertical, Star, ExternalLink, X } from "lucide-react";
import { toast } from "react-toastify";
import { getSiteIconUrl } from "@/lib/site-icon";

interface Site {
  _id: string;
  name: string;
  url: string;
  description?: string;
  icon?: string;
  snapshot?: string;
  voteCount: number;
  featured: boolean;
  weight: number;
}

export default function TrendingManage() {
  const t = useTranslations("dashboard");
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Site[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchTrendingSites = useCallback(async () => {
    try {
      const res = await fetch("/api/sites?trending=true&limit=12");
      const data = await res.json();
      setSites(data.sites || []);
    } catch (error) {
      console.error("Fetch trending sites error:", error);
      // Fallback to seed data
      const { getSeedTrendingSites } = await import("@/lib/seed-data");
      setSites(getSeedTrendingSites(12));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrendingSites();
  }, [fetchTrendingSites]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/sites?search=${encodeURIComponent(query)}&limit=20`);
      const data = await res.json();
      setSearchResults(data.sites || []);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleSetFeatured = async (siteId: string, featured: boolean, weight?: number) => {
    try {
      const res = await fetch("/api/sites/manage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId, updates: { featured, weight: weight ?? 50 } }),
      });
      if (res.ok) {
        toast.success(featured ? t("addedToFeatured") : t("removedFromFeatured"));
        fetchTrendingSites();
      }
    } catch (error) {
      toast.error(t("operationFailed"));
    }
  };

  const handleUpdateWeight = async (siteId: string, weight: number) => {
    try {
      await fetch("/api/sites/manage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId, updates: { weight } }),
      });
      fetchTrendingSites();
    } catch (error) {
      toast.error(t("operationFailed"));
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-default-400">{t("loading")}</div>;
  }

  return (
    <div className="space-y-4">
      {/* 说明 */}
      <p className="text-sm text-default-500 mb-4">
        {t("trendingInfo")}
      </p>

      {/* 当前热门列表 */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-default-600 mb-2">{t("currentTrending")} ({sites.length})</h3>
        <div className="grid gap-2">
          {sites.map((site, index) => (
            <div
              key={site._id}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-default-200 hover:border-orange-300 transition-colors"
            >
              <span className="text-xs text-default-400 w-6">{index + 1}</span>
              <GripVertical size={14} className="text-default-300 cursor-grab" />
              <img 
                src={getSiteIconUrl(site.icon, site.url) || `https://www.google.com/s2/favicons?domain=${new URL(site.url).hostname}&sz=64`} 
                alt="" 
                className="w-5 h-5 rounded" 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{site.name}</span>
                  {site.featured && (
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <span className="text-xs text-default-400 truncate block">{site.url}</span>
              </div>
              <span className="text-xs text-orange-500 font-medium">👍 {site.voteCount}</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={site.weight}
                  onChange={(e) => handleUpdateWeight(site._id, parseInt(e.target.value) || 50)}
                  className="w-16 px-2 py-1 text-xs border rounded"
                  placeholder="权重"
                />
                <a href={site.url} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-default-100 rounded">
                  <ExternalLink size={14} className="text-default-400" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 添加到热门 */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-default-600 mb-2">{t("addToTrending")}</h3>
        <p className="text-xs text-default-400 mb-2">{t("addToTrendingDesc")}</p>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t("searchSites")}
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setSearchResults([]); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-default-100 rounded"
            >
              <X size={14} />
            </button>
          )}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-auto z-10">
              {searchResults.map((site) => (
                <div
                  key={site._id}
                  className="flex items-center gap-2 p-2 hover:bg-default-50 cursor-pointer"
                  onClick={() => handleSetFeatured(site._id, true, 90)}
                >
                  <span className="font-medium text-sm">{site.name}</span>
                  <span className="text-xs text-default-400">{site.url}</span>
                  {!site.featured && (
                    <button className="ml-auto px-2 py-0.5 text-xs bg-primary-500 text-white rounded hover:bg-primary-600">
                      {t("add")}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
