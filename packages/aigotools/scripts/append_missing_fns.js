/**
 * append_missing_fns.js
 * 往 seed-data.ts 末尾追加三个缺失函数
 */

const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "src", "lib", "seed-data.ts");

const FNS = `
/**
 * 获取热门站点（按 voteCount 降序）
 */
export function getSeedTrendingSites(size = 12): Site[] {
  return SEED_SITES
    .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))
    .slice(0, size);
}

/**
 * 获取站点统计数据（seed 降级用）
 */
export function getSeedSiteStats(): {
  totalSites: number;
  totalCategories: number;
  totalVotes: number;
  avgRating: string;
} {
  const totalSites = SEED_SITES.length;
  const catSet = new Set<string>();
  let totalVotes = 0;
  let ratingSum = 0;
  let ratingCount = 0;
  for (const s of SEED_SITES) {
    for (const c of s.categories) catSet.add(c);
    totalVotes += s.voteCount || 0;
    if (s.rating !== undefined) {
      ratingSum += s.rating;
      ratingCount++;
    }
  }
  const avgRating =
    ratingCount > 0 ? (ratingSum / ratingCount).toFixed(1) : "4.2";
  return { totalSites, totalCategories: catSet.size, totalVotes, avgRating };
}

/**
 * 根据分类获取相关站点（seed 降级用）
 */
export function getSeedRelatedByCategory(siteKey: string, size = 4): Site[] {
  const site = SEED_SITES.find((s) => s.siteKey === siteKey);
  if (!site) return [];
  return SEED_SITES.filter(
    (s) =>
      s.siteKey !== siteKey &&
      s.categories.some((c: string) => site.categories.includes(c))
  )
    .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))
    .slice(0, size);
}
`;

function main() {
  const content = fs.readFileSync(FILE, "utf8");
  // 防止重复追加：检查是否已存在
  if (content.includes("export function getSeedTrendingSites")) {
    console.log("函数已存在，跳过追加");
    return;
  }
  fs.appendFileSync(FILE, FNS, "utf8");
  console.log("✅ 已追加 3 个函数到 seed-data.ts");
}

main();
