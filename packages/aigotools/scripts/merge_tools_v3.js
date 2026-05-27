/**
 * merge_tools_v3.js
 * 正确合并 aibot_tools.json → seed-data.ts
 * 修复：state/processStage 枚举值处理
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SEED_FILE = path.join(ROOT, "src", "lib", "seed-data.ts");
const JSON_FILE = path.join(__dirname, "aibot_tools.json");

// state 字符串 → SiteState 枚举
function mapState(val) {
  if (!val) return "SiteState.unpublished";
  const v = String(val).toLowerCase();
  if (v === "published") return "SiteState.published";
  if (v === "unpublished") return "SiteState.unpublished";
  return "SiteState.unpublished";
}

// processStage 字符串 → ProcessStage 枚举
function mapProcessStage(val) {
  if (!val) return "ProcessStage.pending";
  const v = String(val).toLowerCase();
  if (v === "success") return "ProcessStage.success";
  if (v === "pending") return "ProcessStage.pending";
  if (v === "failed") return "ProcessStage.failed";
  return "ProcessStage.pending";
}

function loadJson() {
  return JSON.parse(fs.readFileSync(JSON_FILE, "utf8"));
}

function loadSeed() {
  return fs.readFileSync(SEED_FILE, "utf8");
}

/**
 * 找到 SEED_SITES 数组最外层闭合 ] 的位置
 * 策略：找到 "const SEED_SITES: Site[] = [" 之后，
 * 用括号计数（正确处理字符串内的括号）
 */
function findArrayClosePos(content) {
  const declMatch = content.match(/const SEED_SITES\s*:\s*Site\[\]\s*=\s*\[/);
  if (!declMatch) throw new Error("找不到 SEED_SITES 声明");
  let pos = declMatch.index + declMatch[0].length;

  let depth = 1; // 已进入数组
  let i = pos;
  while (i < content.length && depth > 0) {
    const ch = content[i];
    // 跳过字符串
    if (ch === '"' || ch === "'" || ch === "`") {
      const q = ch;
      i++;
      while (i < content.length) {
        if (content[i] === "\\") { i += 2; continue; }
        if (content[i] === q) break;
        i++;
      }
      i++;
      continue;
    }
    // 跳过单行注释
    if (ch === "/" && content[i + 1] === "/") {
      while (i < content.length && content[i] !== "\n") i++;
      continue;
    }
    // 跳过块注释
    if (ch === "/" && content[i + 1] === "*") {
      i += 2;
      while (i < content.length) {
        if (content[i] === "*" && content[i + 1] === "/") { i += 2; break; }
        i++;
      }
      continue;
    }
    if (ch === "[" || ch === "{") { depth++; }
    else if (ch === "]" || ch === "}") { depth--; }
    i++;
  }
  if (depth !== 0) throw new Error("找不到 SEED_SITES 数组的闭合 ]");
  // i 现在在 ] 后面一个字符
  return i - 1; // ] 的位置
}

function escapeTs(str) {
  if (typeof str !== "string") return JSON.stringify(str);
  return '"' + str.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
}

function siteToTs(obj) {
  const lines = [];
  for (const [key, val] of Object.entries(obj)) {
    if (val === null || val === undefined) {
      lines.push(`    ${key}: "",`);
      continue;
    }
    if (key === "_id" || key === "userId" || key === "siteKey" || key === "url" || key === "name" || key === "icon" || key === "subCategory" || key === "description" || key === "pricingType" || key === "snapshot") {
      lines.push(`    ${key}: ${escapeTs(val)},`);
    } else if (key === "state") {
      lines.push(`    state: ${mapState(val)},`);
    } else if (key === "processStage") {
      lines.push(`    processStage: ${mapProcessStage(val)},`);
    } else if (key === "featured") {
      lines.push(`    featured: ${val === true || val === "true" ? "true" : "false"},`);
    } else if (key === "categories" && Array.isArray(val)) {
      // categories 是字符串数组，保持原样（seed-data.ts 里是字符串数组）
      const arr = "[" + val.map(v => escapeTs(v)).join(", ") + "]";
      lines.push(`    categories: ${arr},`);
    } else if (Array.isArray(val)) {
      const arr = "[" + val.map(v => escapeTs(v)).join(", ") + "]";
      lines.push(`    ${key}: ${arr},`);
    } else if (typeof val === "number") {
      lines.push(`    ${key}: ${val},`);
    } else if (typeof val === "boolean") {
      lines.push(`    ${key}: ${val},`);
    } else if (key === "links" && typeof val === "object" && !Array.isArray(val)) {
      const entries = Object.entries(val).map(([k, v]) => `      ${k}: ${escapeTs(v)},`).join("\n");
      lines.push(`    links: {\n${entries}\n    },`);
    } else {
      lines.push(`    ${key}: ${escapeTs(val)},`);
    }
  }
  return "  {\n" + lines.join("\n") + "\n  }";
}

function merge() {
  const tools = loadJson();
  let content = loadSeed();

  const closePos = findArrayClosePos(content);
  console.log(`SEED_SITES 闭合 ] 在字符位置: ${closePos}`);

  // 确认 ] 前是换行+空格+}
  const before = content.substring(Math.max(0, closePos - 50), closePos);
  console.log(`] 前 50 字符: "${before.replace(/\n/g, "\\n")}"`);

  const newEntries = tools.map(t => siteToTs(t)).join(",\n");
  const toInsert = ",\n" + newEntries + "\n";

  const newContent = content.substring(0, closePos) + toInsert + content.substring(closePos);

  fs.writeFileSync(SEED_FILE, newContent, "utf8");
  console.log(`✅ 成功插入 ${tools.length} 个工具`);
  console.log(`文件大小: ${newContent.length} 字节`);
}

merge();
