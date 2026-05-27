import { NextRequest, NextResponse } from "next/server";
import { getSeedFeaturedSites, getSeedLatestSites, getSeedTrendingSites, SEED_SITES } from "@/lib/seed-data";
import { SiteState } from "@/lib/constants";

// GET /api/sites - 查询站点
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const featured = searchParams.get("featured");
  const latest = searchParams.get("latest");
  const trending = searchParams.get("trending");
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") || "12");

  let sites = SEED_SITES.filter(s => s.state === SiteState.published);

  // 热门趋势 - 按点赞数排序
  if (trending === "true") {
    sites = sites.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
    return NextResponse.json({ sites: sites.slice(0, limit) });
  }

  // 精选推荐 - featured=true，按权重排序
  if (featured === "true") {
    sites = sites.filter(s => s.featured).sort((a, b) => (b.weight || 0) - (a.weight || 0));
    return NextResponse.json({ sites: sites.slice(0, limit) });
  }

  // 最新上线 - 按更新时间排序
  if (latest === "true") {
    sites = sites.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    return NextResponse.json({ sites: sites.slice(0, limit) });
  }

  // 搜索
  if (search) {
    const query = search.toLowerCase();
    sites = sites.filter(s => 
      s.name.toLowerCase().includes(query) || 
      s.url.toLowerCase().includes(query) ||
      (s.description && s.description.toLowerCase().includes(query))
    );
  }

  return NextResponse.json({ sites: sites.slice(0, limit) });
}
