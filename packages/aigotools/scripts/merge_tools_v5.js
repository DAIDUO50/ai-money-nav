/**
 * merge_tools_v5.js
 * 在 SEED_SITES 数组的 ]; 前插入新工具
 * 定位方式：找 "];" 后紧跟 "export function getSeedFeaturedSites"
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SEED_FILE = path.join(ROOT, "src", "lib", "seed-data.ts");
const JSON_FILE = path.join(__dirname, "aibot_tools.json");

const NOW = Date.now();

function mapState(v) {
  if (!v) return "SiteState.unpublished";
  const s = String(v).toLowerCase();
  return s === "published" ? "SiteState.published" : "SiteState.unpublished";
}
function mapProcessStage(v) {
  if (!v) return "ProcessStage.pending";
  const s = String(v).toLowerCase();
  if (s === "success") return "ProcessStage.success";
  if (s === "pending") return "ProcessStage.pending";
  return "ProcessStage.pending";
}

function esc(s) {
  if (typeof s !== "string") return JSON.stringify(s);
  return '"' + s.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
}

function siteToTs(obj) {
  const has = (k) => obj[k] !== undefined && obj[k] !== null;

  const _id = has("_id") ? obj._id : ("site-" + (obj.siteKey || obj.name || "unk").toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  const userId = has("userId") ? obj.userId : "00000000000000000";
  const siteKey = has("siteKey") ? obj.siteKey : _id.replace(/^site-/, "");
  const url = has("url") ? obj.url : "";
  const name = has("name") ? obj.name : "";
  const icon = has("icon") ? obj.icon : "";
  const subCategory = has("subCategory") ? obj.subCategory : "";
  const featured = has("featured") ? (obj.featured === true || obj.featured === "true") : false;
  const weight = has("weight") ? Number(obj.weight) : 0;
  const snapshot = has("snapshot") ? obj.snapshot : ("https://image.thum.io/get/width/640/crop/360/" + (url || ""));
  const description = has("description") ? obj.description : "";
  const pricingType = has("pricingType") ? obj.pricingType : "";
  const categories = has("categories") ? obj.categories : [];
  const images = has("images") ? obj.images : [];
  const features = has("features") ? obj.features : [];
  const usecases = has("usecases") ? obj.usecases : [];
  const users = has("users") ? obj.users : [];
  const relatedSearches = has("relatedSearches") ? obj.relatedSearches : [];
  const pricings = has("pricings") ? obj.pricings : [];
  const links = has("links") ? obj.links : {};
  const voteCount = has("voteCount") ? Number(obj.voteCount) : 0;
  const rating = has("rating") ? Number(obj.rating) : 4.0;
  const metaKeywords = has("metaKeywords") ? obj.metaKeywords : [];
  const metaDescription = has("metaDescription") ? obj.metaDescription : "";
  const searchSuggestWords = has("searchSuggestWords") ? obj.searchSuggestWords : [];
  const state = mapState(obj.state);
  const processStage = mapProcessStage(obj.processStage);
  const createdAt = has("createdAt") ? Number(obj.createdAt) : NOW;
  const updatedAt = has("updatedAt") ? Number(obj.updatedAt) : NOW;

  function arr(a) { return "[" + a.map(v => esc(v)).join(", ") + "]"; }
  function objToTs(o) {
    const entries = Object.entries(o).map(([k, v]) => "      " + k + ": " + esc(v) + ",").join("\n");
    return "{\n" + entries + "\n    }";
  }

  return `  {
    _id: ${esc(_id)},
    userId: ${esc(userId)},
    siteKey: ${esc(siteKey)},
    url: ${esc(url)},
    name: ${esc(name)},
    icon: ${esc(icon)},
    subCategory: ${esc(subCategory)},
    featured: ${featured},
    weight: ${weight},
    snapshot: ${esc(snapshot)},
    description: ${esc(description)},
    pricingType: ${esc(pricingType)},
    categories: ${arr(categories)},
    images: ${arr(images)},
    features: ${arr(features)},
    usecases: ${arr(usecases)},
    users: ${arr(users)},
    relatedSearches: ${arr(relatedSearches)},
    pricings: ${arr(pricings)},
    links: ${objToTs(links)},
    voteCount: ${voteCount},
    rating: ${rating},
    metaKeywords: ${arr(metaKeywords)},
    metaDescription: ${esc(metaDescription)},
    searchSuggestWords: ${arr(searchSuggestWords)},
    state: ${state},
    processStage: ${processStage},
    createdAt: ${createdAt},
    updatedAt: ${updatedAt},
  }`;
}

function merge() {
  const tools = JSON.parse(fs.readFileSync(JSON_FILE, "utf8"));
  const lines = fs.readFileSync(SEED_FILE, "utf8").split("\n");

  // 找 "export function getSeedFeaturedSites" 的行号
  let fnLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("export function getSeedFeaturedSites")) {
      fnLine = i;
      break;
    }
  }
  if (fnLine === -1) throw new Error("找不到 export function getSeedFeaturedSites");

  // 往前找 ];
  let closeLine = -1;
  for (let i = fnLine - 1; i >= 0; i--) {
    if (lines[i].trim() === "];") {
      closeLine = i;
      break;
    }
  }
  if (closeLine === -1) throw new Error("找不到 SEED_SITES 的 ];");

  console.log(`在行 ${closeLine + 1} (];) 之前插入 ${tools.length} 个工具`);

  const newEntries = tools.map(t => siteToTs(t)).join(",\n") + ",";
  lines.splice(closeLine, 0, newEntries);

  const newContent = lines.join("\n");
  fs.writeFileSync(SEED_FILE, newContent, "utf8");
  console.log(`✅ 完成！文件行数: ${lines.length}`);
}

merge();
