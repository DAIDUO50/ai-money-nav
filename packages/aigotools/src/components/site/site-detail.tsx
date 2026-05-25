"use client";

import dayjs from "dayjs";
import { Button, Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { ExternalLink, Heart, Copy, Star, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";

import { Site } from "@/models/site";

interface SiteDetailProps {
  site: Site;
  featuredSites?: Site[];
}

export default function SiteDetail({ site, featuredSites = [] }: SiteDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorited, setIsFavorited] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const getPricingColor = (pricingType: string) => {
    if (!pricingType) return "from-blue-500 to-cyan-500";
    if (pricingType.includes("免费") || pricingType === "Free") {
      return "from-green-500 to-emerald-500";
    }
    if (pricingType === "付费" || pricingType === "Paid") {
      return "from-purple-500 to-violet-500";
    }
    return "from-blue-500 to-cyan-500";
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      "bg-blue-50 text-blue-600 border-blue-200",
      "bg-purple-50 text-purple-600 border-purple-200",
      "bg-green-50 text-green-600 border-green-200",
      "bg-orange-50 text-orange-600 border-orange-200",
      "bg-pink-50 text-pink-600 border-pink-200",
      "bg-cyan-50 text-cyan-600 border-cyan-200",
    ];
    return colors[index % colors.length];
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: Implement favorite logic with backend
  };

  const overviewContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-3">关于此工具</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{site.description}</p>
      </div>

      {site.features && site.features.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-3">核心功能</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {site.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-zinc-800">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {site.pricings && site.pricings.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-3">价格方案</h3>
          <div className="flex flex-wrap gap-2">
            {site.pricings.map((price, i) => (
              <span key={i} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-zinc-800 dark:to-zinc-800 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-700">
                {price}
              </span>
            ))}
          </div>
        </div>
      )}

      {site.users && site.users.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-3">适用人群</h3>
          <div className="flex flex-wrap gap-2">
            {site.users.map((user, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-sm text-gray-600 dark:text-gray-400">
                {user}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const featuresContent = (
    <div className="space-y-4">
      {site.features && site.features.map((feature, i) => (
        <Card key={i} className="border-none bg-gray-50 dark:bg-zinc-800/50">
          <CardBody className="flex-row items-start gap-4 p-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
              {i + 1}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{feature}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">点击概览查看详细说明</p>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );

  const usecasesContent = (
    <div className="space-y-4">
      {site.usecases && site.usecases.map((usecase, i) => (
        <Card key={i} className="border-none bg-gray-50 dark:bg-zinc-800/50">
          <CardBody className="flex-row items-start gap-4 p-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
              {i + 1}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{usecase}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">适用于需要{usecase}的场景</p>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="py-9 max-w-7xl mx-auto px-4">
      {/* Header Section */}
      <div className="relative mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-violet-600/10 border border-purple-200/50 dark:border-zinc-700">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
              <span className="text-4xl font-bold text-white">{site.name.charAt(0).toUpperCase()}</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{site.name}</h1>
              <span className={clsx(
                "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white whitespace-nowrap",
                "bg-gradient-to-r",
                getPricingColor(site.pricingType)
              )}>
                {site.pricingType || "未知"}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed line-clamp-2">{site.description}</p>

            {/* Meta info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>使用次数: {site.voteCount || 0}</span>
              <span>更新时间: {dayjs(site.updatedAt).format("YYYY-MM-DD")}</span>
              <span>支持语言: 中文、英文</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <Button
            as={Link}
            href={site.url}
            target="_blank"
            className="font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/25"
            radius="full"
            size="md"
            startContent={<ExternalLink size={16} />}
          >
            访问网站
          </Button>

          <Button
            className={clsx(
              "font-medium",
              isFavorited
                ? "bg-red-50 text-red-600 border-red-200"
                : "bg-white text-gray-600 border-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:border-zinc-700"
            )}
            radius="full"
            size="md"
            variant="bordered"
            startContent={<Heart size={16} className={isFavorited ? "fill-red-500 text-red-500" : ""} />}
            onClick={handleFavorite}
          >
            {isFavorited ? "已收藏" : "收藏"}
          </Button>

          <Button
            className="font-medium bg-white text-gray-600 border-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:border-zinc-700"
            radius="full"
            size="md"
            variant="bordered"
            startContent={isCopied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
            onClick={handleCopyLink}
          >
            {isCopied ? "已复制" : "复制链接"}
          </Button>
        </div>
      </div>

      {/* Category Tags */}
      {site.categories && site.categories.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {site.categories.map((category, index) => (
              <span
                key={category}
                className={clsx(
                  "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border",
                  getCategoryColor(index)
                )}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Content with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Content */}
        <div className="flex-1 min-w-0">
          {/* Tabs */}
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            className="mb-6"
            classNames={{
              tabList: "bg-gray-50 dark:bg-zinc-800 p-1 rounded-xl",
              cursor: "bg-white dark:bg-zinc-700 shadow-sm rounded-lg",
              tab: "px-4 py-2",
              tabContent: "group-data-[selected=true]:text-gray-900 dark:group-data-[selected=true]:text-white",
            }}
          >
            <Tab key="overview" title="概览">
              <div className="py-4">{overviewContent}</div>
            </Tab>
            <Tab key="features" title="核心功能">
              <div className="py-4">{featuresContent}</div>
            </Tab>
            <Tab key="usecases" title="应用场景">
              <div className="py-4">{usecasesContent}</div>
            </Tab>
          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="flex-shrink-0 w-full lg:w-80">
          <Card className="border-none bg-gray-50 dark:bg-zinc-800/50 sticky top-4">
            <CardBody className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">精选工具推荐</h3>

              {featuredSites && featuredSites.length > 0 ? (
                <div className="space-y-3">
                  {featuredSites.map((featuredSite) => (
                    <Link
                      key={featuredSite._id}
                      href={`/s/${featuredSite.siteKey}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <div className="w-10 h-10 rounded bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {featuredSite.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-white truncate">{featuredSite.name}</div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Star size={12} className="fill-yellow-400 text-yellow-400" />
                          <span>{featuredSite.rating || 4.0}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {featuredSite.categories?.slice(0, 2).map((cat) => (
                          <span key={cat} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-400">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">暂无精选工具推荐</p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}