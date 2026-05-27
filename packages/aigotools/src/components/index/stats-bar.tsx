"use client";

interface StatsBarProps {
  stats: {
    totalSites: number;
    totalCategories: number;
    totalVotes: number;
    avgRating: string;
  };
}

export default function StatsBar({ stats }: StatsBarProps) {
  const items = [
    { emoji: "🔗", label: "工具总数", value: stats.totalSites > 100 ? `${Math.floor(stats.totalSites / 100)}00+` : `${stats.totalSites}+` },
    { emoji: "📂", label: "分类数量", value: `${stats.totalCategories}+` },
    { emoji: "👥", label: "总收藏数", value: stats.totalVotes > 1000 ? `${(stats.totalVotes / 1000).toFixed(0)},000+` : `${stats.totalVotes.toLocaleString()}+` },
    { emoji: "⭐", label: "平均评分", value: stats.avgRating },
  ];

  return (
    <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-zinc-800 dark:to-zinc-800 border border-blue-100/50 dark:border-zinc-700 shadow-sm"
        >
          <span className="text-xl">{item.emoji}</span>
          <div>
            <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {item.value}
            </div>
            <div className="text-xs text-primary-400">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
