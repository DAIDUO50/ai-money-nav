"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Clock, ExternalLink, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { getSiteIconUrl } from "@/lib/site-icon";

interface Site {
  _id: string;
  name: string;
  url: string;
  description?: string;
  icon?: string;
  snapshot?: string;
  updatedAt: number;
  state: string;
}

export default function LatestManage() {
  const t = useTranslations("dashboard");
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLatestSites = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/sites?latest=true&limit=12");
      const data = await res.json();
      setSites(data.sites || []);
    } catch (error) {
      console.error("Fetch latest sites error:", error);
      // Fallback to seed data
      const { getSeedLatestSites } = await import("@/lib/seed-data");
      setSites(getSeedLatestSites());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestSites();
  }, [fetchLatestSites]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="text-center py-8 text-default-400">{t("loading")}</div>;
  }

  return (
    <div className="space-y-4">
      {/* 说明 */}
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-default-500">
          {t("latestInfo")}
        </p>
        <button
          onClick={fetchLatestSites}
          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-default-100 hover:bg-default-200 rounded-lg transition-colors"
        >
          <RefreshCw size={12} />
          {t("refresh")}
        </button>
      </div>

      {/* 最新列表 */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-default-600 mb-2">{t("latestSites")} ({sites.length})</h3>
        <div className="grid gap-2">
          {sites.map((site, index) => (
            <div
              key={site._id}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-default-200 hover:border-blue-300 transition-colors"
            >
              <span className="text-xs text-default-400 w-6">{index + 1}</span>
              <Clock size={14} className="text-blue-500" />
              <img 
                src={getSiteIconUrl(site.icon, site.url) || `https://www.google.com/s2/favicons?domain=${new URL(site.url).hostname}&sz=64`} 
                alt="" 
                className="w-5 h-5 rounded" 
              />
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm truncate">{site.name}</span>
                <span className="text-xs text-default-400 truncate block">{site.url}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-default-500">{formatDate(site.updatedAt)}</span>
                <span className={`text-xs ml-2 px-2 py-0.5 rounded ${
                  site.state === "published" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                }`}>
                  {site.state === "published" ? t("published") : t("pending")}
                </span>
              </div>
              <a href={site.url} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-default-100 rounded">
                <ExternalLink size={14} className="text-default-400" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 提示 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-600">
          {t("latestTip")}
        </p>
      </div>
    </div>
  );
}
