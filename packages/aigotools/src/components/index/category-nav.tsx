"use client";

import { useRouter } from "@/navigation";

interface CategoryNavProps {
  categories: Array<{ _id: string; name: string; icon?: string }>;
}

const categoryDisplayNames: Record<string, string> = {
  "AI对话": "💬 AI对话",
  "AI编程": "💻 AI编程",
  "AI写作": "✏️ AI写作",
  "AI制图": "🎨 AI制图",
  "AI视频": "🎬 AI视频",
  "AI音乐": "🎵 AI音乐",
  "AI搜索": "🔍 AI搜索",
  "AI教育": "📚 AI教育",
  "AI办公": "💼 AI办公",
  "AI自动化": "🤖 AI自动化",
  "AI赚钱": "💰 AI赚钱",
  "AI数据分析": "📊 AI数据分析",
  "AI助手": "🧑‍💻 AI助手",
  "AI翻译": "🌍 AI翻译",
  "AI目录导航": "📃 AI目录导航",
};

export default function CategoryNav({ categories }: CategoryNavProps) {
  const router = useRouter();

  const displayCategories = categories.map((c) => ({
    name: c.name,
    label: categoryDisplayNames[c.name] || `${c.icon || "📌"} ${c.name}`,
  }));

  return (
    <div className="mt-6 sm:mt-8 overflow-x-auto scrollbar-hide pb-2">
      <div className="flex items-center gap-2 min-w-max px-1">
        {displayCategories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => router.push(`/search?c=${encodeURIComponent(cat.name)}`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-primary-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
