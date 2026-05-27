/**
 * 数据迁移脚本：将 seed-data.ts 中的站点和分类数据导入 MongoDB
 * 用法: npx tsx scripts/seed-to-mongo.ts
 */
import mongoose from "mongoose";
import { SEED_SITES, SEED_CATEGORIES } from "../src/lib/seed-data";
import { SiteModel } from "../src/models/site";
import { CategoryModel } from "../src/models/category";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/aigotools";

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("Connected!");

  // 1. 先导入分类（忽略 _id 和 parent，让 MongoDB 自动生成 ObjectId）
  console.log(`Importing ${SEED_CATEGORIES.length} categories...`);
  const nameToId = new Map<string, mongoose.Types.ObjectId>();
  for (const cat of SEED_CATEGORIES) {
    const existing = await CategoryModel.findOne({ name: cat.name });
    if (existing) {
      nameToId.set(cat.name, existing._id as mongoose.Types.ObjectId);
    } else {
      const { _id, parent, ...rest } = cat;
      const created = await CategoryModel.create({ ...rest, parent: null });
      nameToId.set(cat.name, created._id as mongoose.Types.ObjectId);
    }
  }
  console.log(`Categories imported. ${nameToId.size} categories in DB.`);

  // 2. 导入站点（将分类名映射为 ObjectId）
  console.log(`Importing ${SEED_SITES.length} sites...`);
  let imported = 0;
  let skipped = 0;
  for (const site of SEED_SITES) {
    const existing = await SiteModel.findOne({ siteKey: site.siteKey });
    if (existing) {
      skipped++;
      continue;
    }
    // 映射分类名 → ObjectId
    const categoryIds = (site.categories || [])
      .map((name: string) => nameToId.get(name))
      .filter(Boolean) as mongoose.Types.ObjectId[];
    
    const { _id, ...rest } = site;
    await SiteModel.create({
      ...rest,
      categories: categoryIds,
    });
    imported++;
  }
  console.log(`Sites imported: ${imported}, skipped (existing): ${skipped}`);

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
