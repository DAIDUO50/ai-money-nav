import { NextRequest, NextResponse } from "next/server";
import { SEED_SITES } from "@/lib/seed-data";

// 由于没有MongoDB，这里只返回成功响应模拟操作
// 实际部署时需要连接数据库

// PATCH /api/sites/manage - 更新站点属性
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteId, updates } = body;

    if (!siteId || !updates) {
      return NextResponse.json(
        { error: "Missing siteId or updates" },
        { status: 400 }
      );
    }

    // 查找站点在 seed data 中的位置
    const siteIndex = SEED_SITES.findIndex(s => s._id === siteId);
    
    if (siteIndex === -1) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      );
    }

    // 更新站点属性（仅在内存中，不持久化）
    const site = SEED_SITES[siteIndex];
    Object.assign(site, updates, { updatedAt: Date.now() });

    return NextResponse.json({ 
      success: true, 
      site: {
        _id: site._id,
        name: site.name,
        featured: site.featured,
        weight: site.weight,
        voteCount: site.voteCount,
      }
    });
  } catch (error) {
    console.error("Update site error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
