"use client";
import { useQuery } from "@tanstack/react-query";

import CategoryTag from "@/components/index/cateogry-tag";
import Loading from "@/components/common/loading";
import { getAllCategories } from "@/lib/actions";
import { useRouter } from "@/navigation";

export default function CategoriesList() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["get-all-categories"],
    queryFn: async () => {
      return await getAllCategories();
    },
    initialData: [],
  });

  const router = useRouter();

  // AI categories to feature at top
  const aiCategories = [
    { name: "AI对话", icon: "🤖", href: "/categories?c=AI对话" },
    { name: "AI制图", icon: "🎨", href: "/categories?c=AI制图" },
    { name: "AI写作", icon: "📝", href: "/categories?c=AI写作" },
    { name: "AI编程", icon: "💻", href: "/categories?c=AI编程" },
    { name: "AI办公", icon: "🏢", href: "/categories?c=AI办公" },
    { name: "AI教育", icon: "📚", href: "/categories?c=AI教育" },
  ];

  return (
    <div className="relative min-h-96 mt-8">
      {/* AI Categories at top */}
      <div className="mb-8">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full" />
          AI 分类
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {aiCategories.map((category) => (
            <div
              key={category.name}
              className="group cursor-pointer"
              onClick={() => router.push(category.href)}
            >
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-purple-100 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105 text-center">
                <span className="text-3xl mb-2 block">{category.icon}</span>
                <span className="font-medium text-primary-700 group-hover:text-purple-600">{category.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All categories */}
      <div>
        {categories.map((category) => {
          return (
            <div key={category._id} className="mb-6">
              <h3 className="font-medium text-xl flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-purple-600 to-violet-600 rounded-full" />
                {[category.icon, category.name].filter(Boolean).join(" ")}
              </h3>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {category.children.map((item, index) => {
                  // Add hot/new badges for featured items
                  const isHot = index < 2 && category.featured;
                  const isNew = index >= 2 && index < 4 && category.featured;
                  
                  return (
                    <CategoryTag
                      key={item._id}
                      variant={isHot ? "hot" : isNew ? "new" : "default"}
                      onClick={() => {
                        const url = `/categories?c=${encodeURIComponent(
                          item.name
                        )}`;

                        router.push(url);
                      }}
                    >
                      {[item.icon, item.name].filter(Boolean).join(" ")}
                    </CategoryTag>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <Loading isLoading={isLoading} />
    </div>
  );
}