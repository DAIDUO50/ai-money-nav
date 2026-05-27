"use client";

import dayjs from "dayjs";
import { Button, Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { ExternalLink, Heart, Copy, Star, CheckCircle2, Bot } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";

import { Site } from "@/models/site";
import { getSiteIconUrl } from "@/lib/site-icon";

interface SiteDetailProps {
  site: Site;
  featuredSites?: Site[];
}

/** Site icon with Iconify and favicon fallback */
function SiteIcon({ site, size = 24 }: { site: Site; size?: number }) {
  const [iconError, setIconError] = useState(false);

  const iconSrc = getSiteIconUrl(site.icon, site.url);

  // No valid icon or error - show default bot icon
  if (!iconSrc || iconError) {
    return <Bot size={size} className="text-white" />;
  }

  return (
    <img
      src={iconSrc}
      alt={site.name}
      className="w-full h-full object-contain"
      onError={() => setIconError(true)}
      loading="lazy"
    />
  );
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

      {/* 用它们是做什么的 */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-zinc-800 dark:to-zinc-800 border border-blue-100 dark:border-zinc-700">
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          用它们是做什么的
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          {site.name} 是一款强大的AI工具，可以帮助你{site.description?.replace(/^.*?可以/, '').replace(/。.*$/, '') || '完成各种智能任务'}。
          无论你是想提高工作效率、激发创意灵感，还是解决复杂问题，它都能成为你的得力助手。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 dark:bg-zinc-700/60">
            <span className="text-xl">⚡</span>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">提升效率</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">自动化处理重复性工作，节省时间</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 dark:bg-zinc-700/60">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">激发创意</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">提供新思路和灵感，突破思维局限</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 dark:bg-zinc-700/60">
            <span className="text-xl">🎓</span>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">学习成长</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">快速获取知识，加速技能提升</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 dark:bg-zinc-700/60">
            <span className="text-xl">🚀</span>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">创造价值</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">产出高质量内容，实现商业变现</p>
            </div>
          </div>
        </div>
      </div>

      {/* 用它们赚钱的思路 */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-zinc-800 dark:to-zinc-800 border border-amber-100 dark:border-zinc-700">
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
          <span className="text-2xl">💰</span>
          用它们赚钱的思路
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          掌握 {site.name} 的使用技巧，你可以通过以下方式实现变现：
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 dark:bg-zinc-700/60">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">1</div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">内容创作变现</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">利用AI生成文章、视频脚本、社交媒体内容，通过自媒体平台获取流量收益</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 dark:bg-zinc-700/60">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">2</div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">提供AI服务</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">在闲鱼、淘宝等平台提供AI代写、AI绘画、AI咨询等服务，按单收费</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 dark:bg-zinc-700/60">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">3</div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">开发AI产品</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">基于AI能力开发小程序、网站或工具，通过订阅或广告盈利</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 dark:bg-zinc-700/60">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">4</div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">知识付费</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">制作AI使用教程、提示词模板，通过知识星球、小册等平台销售</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 dark:bg-zinc-700/60">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">5</div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">提升主业收入</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">用AI提高工作效率，承接更多项目，或在职场中获得晋升加薪机会</p>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-amber-100/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
            <span className="text-lg">💡</span>
            <span><strong>提示：</strong>选择适合自己技能和资源的变现方式，从小规模开始测试，逐步放大。持续学习和优化是关键！</span>
          </p>
        </div>
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

  const faqContent = (
    <div className="space-y-4">
      {(site as any).faq && (site as any).faq.length > 0 ? (
        (site as any).faq.map((item: { q: string; a: string }, i: number) => (
          <Card key={i} className="border-none bg-gray-50 dark:bg-zinc-800/50">
            <CardBody className="p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">❓ {item.q}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.a}</p>
            </CardBody>
          </Card>
        ))
      ) : (
        <div className="text-center py-12">
          <span className="text-4xl mb-3 block">📋</span>
          <p className="text-gray-500 dark:text-gray-400">暂无常见问题</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="py-9 max-w-7xl mx-auto px-4">
      {/* Full-width Banner */}
      <div className="w-full h-[200px] sm:h-[240px] rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
        <img
          src={`https://image.thum.io/get/width/1200/crop/480/${site.url}`}
          alt={site.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
        />
      </div>

      {/* Header Section */}
      <div className="relative mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-violet-600/10 border border-purple-200/50 dark:border-zinc-700">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg p-4">
              <SiteIcon site={site} size={48} />
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
            <Tab key="faq" title="FAQ">
              <div className="py-4">{faqContent}</div>
            </Tab>
          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="flex-shrink-0 w-full lg:w-80">
          <Card className="border-none bg-gray-50 dark:bg-zinc-800/50 sticky top-4">
            <CardBody className="p-6">
              {/* Share & Stats */}
              <div className="mb-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">互动</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 min-w-[70px] flex flex-col items-center gap-1 p-3 rounded-xl bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 hover:bg-blue-50 dark:hover:bg-zinc-600 transition-colors"
                  >
                    <span className="text-lg">🔗</span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">复制链接</span>
                  </button>
                  <button
                    className="flex-1 min-w-[70px] flex flex-col items-center gap-1 p-3 rounded-xl bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 hover:bg-green-50 dark:hover:bg-zinc-600 transition-colors"
                  >
                    <span className="text-lg">💬</span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">微信</span>
                  </button>
                  <button
                    className="flex-1 min-w-[70px] flex flex-col items-center gap-1 p-3 rounded-xl bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 hover:bg-red-50 dark:hover:bg-zinc-600 transition-colors"
                  >
                    <span className="text-lg">📱</span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">微博</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-zinc-700 dark:to-zinc-700">
                    <span>👍</span>
                    <div>
                      <div className="text-sm font-bold text-gray-800 dark:text-white">{site.voteCount || 0}</div>
                      <div className="text-xs text-gray-500">使用次数</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-zinc-700 dark:to-zinc-700">
                    <span>⭐</span>
                    <div>
                      <div className="text-sm font-bold text-gray-800 dark:text-white">{(site.rating || 4.0).toFixed(1)}</div>
                      <div className="text-xs text-gray-500">平均评分</div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
                  最后更新: {dayjs(site.updatedAt).format("YYYY-MM-DD")}
                </div>
              </div>

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