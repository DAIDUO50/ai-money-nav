/**
 * merge_tools_v2.js
 * 正确合并 aibot_tools.json → seed-data.ts
 * 策略：找到 SEED_SITES 数组的闭合 ]; 在其前插入新条目
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SEED_FILE = path.join(ROOT, "src", "lib", "seed-data.ts");
const JSON_FILE = path.join(__dirname, "aibot_tools.json");

function loadJson() {
  const raw = fs.readFileSync(JSON_FILE, "utf8");
  return JSON.parse(raw);
}

function loadSeed() {
  return fs.readFileSync(SEED_FILE, "utf8");
}

/**
 * 找到 SEED_SITES 数组的闭合 ]; 位置
 * 方法：找到 "const SEED_SITES: Site[] = [" 之后的内容，
 * 用括号计数找到最外层的 ]，且后面紧跟 ]; 和换行+
 * export function 或文件结束
 */
function findArrayClosePos(content) {
  const declMatch = content.match(/const SEED_SITES\s*:\s*Site\[\]\s*=\s*\[/);
  if (!declMatch) throw new Error("找不到 SEED_SITES 声明");
  const declEnd = declMatch.index + declMatch[0].length;

  // 从声明结束后开始，用括号计数找最外层的 ]
  let depth = 1; // 已经进入数组 [
  let inString = false;
  let stringChar = null;
  let escapeNext = false;

  for (let i = declEnd; i < content.length; i++) {
    const ch = content[i];

    if (escapeNext) { escapeNext = false; continue; }
    if (ch === "\\") { escapeNext = true; continue; }

    if (inString) {
      if (ch === stringChar) inString = false;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true;
      stringChar = ch;
      continue;
    }

    if (ch === "[" || ch === "{") { depth++; continue; }
    if (ch === "]" || ch === "}") {
      depth--;
      if (depth === 0) {
        // 检查后面是否紧跟 ];（数组闭合）
        let j = i + 1;
        while (j < content.length && (content[j] === " " || content[j] === "\t")) j++;
        if (j < content.length && content[j] === ";") {
          return i; // 返回 ] 的位置
        }
        // 不是数组闭合，继续（可能是嵌套数组）
        // 重新计数
        depth = 1;
        for (let k = i + 1; k < content.length; k++) {
          const c2 = content[k];
          if (c2 === "[" || c2 === "{") { depth++; }
          else if (c2 === "]" || c2 === "}") {
            depth--;
            if (depth === 0) { i = k; break; }
          }
        }
      }
      continue;
    }
  }
  throw new Error("找不到 SEED_SITES 数组的闭合 ]");
}

function siteToTs(obj) {
  const parts = [];
  for (const [key, val] of Object.entries(obj)) {
    if (val === null || val === undefined) continue;
    const tsKey = key;
    if (Array.isArray(val)) {
      const arrStr = "[" + val.map(v => {
        if (typeof v === "string") return `"${v.replace(/"/g, '\\"')}"`;
        return JSON.stringify(v);
      }).join(", ") + "]";
      parts.push(`    ${tsKey}: ${arrStr},`);
    } else if (typeof val === "string") {
      parts.push(`    ${tsKey}: "${val.replace(/"/g, '\\"')}",`);
    } else {
      parts.push(`    ${tsKey}: ${JSON.stringify(val)},`);
    }
  }
  return "  {\n" + parts.join("\n") + "\n  }";
}

function buildNewEntries(tools) {
  return tools.map(t => siteToTs(t)).join(",\n");
}

function merge() {
  const tools = loadJson();
  let content = loadSeed();

  // 找到 SEED_SITES 数组闭合 ] 的位置
  const closePos = findArrayClosePos(content);
  console.log(`SEED_SITES 闭合 ] 在字符位置: ${closePos}`);

  // 在 ] 前插入新条目（前面加逗号分隔）
  // 找到 ] 前面的换行
  let insertPos = closePos; // 在 ] 前插入
  // 回溯到前一个对象的结束
  const beforeClose = content.lastIndexOf("}", closePos);
  console.log(`最后一个对象结束于: ${beforeClose}`);

  // 在 ]; 前插入：找到 ]; 的位置，在它前面插入新内容
  // 正确做法：在闭合 ] 前加逗号+新条目
  const beforeBracket = closePos; // ] 的位置

  // 检查 ] 前面是否有 }
  const beforeContent = content.substring(beforeBracket - 20, beforeBracket);
  console.log(`] 前 20 字符: "${beforeContent}"`);

  const newEntries = buildNewEntries(tools);
  const toInsert = ",\n" + newEntries + "\n";

  const newContent = content.substring(0, beforeBracket) + toInsert + content.substring(beforeBracket);

  fs.writeFileSync(SEED_FILE, newContent, "utf8");
  console.log(`✅ 成功插入 ${tools.length} 个工具`);
  console.log(`文件大小: ${newContent.length} 字节`);
}

merge();
