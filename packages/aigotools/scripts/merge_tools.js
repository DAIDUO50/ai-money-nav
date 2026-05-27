const fs = require('fs');

const projectRoot = 'C:/Users/Administrator/Desktop/AI网站导航/aigotools-main/packages/aigotools';
const jsonPath = projectRoot + '/scripts/aibot_tools.json';
const seedPath = projectRoot + '/src/lib/seed-data.ts';

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log('Total scraped tools:', data.length);

const seed = fs.readFileSync(seedPath, 'utf8');
const existingKeys = [...seed.matchAll(/siteKey:\s*['"](\w[\w-]*?)['"]/g)].map(m => m[1]);
console.log('Existing siteKeys:', existingKeys.length);

const newTools = data.filter(t => !existingKeys.includes(t.siteKey));
console.log('New tools (non-duplicate):', newTools.length);

if (newTools.length === 0) {
  console.log('Nothing new to add.');
  process.exit(0);
}

function toSiteEntry(tool) {
  const snapshot = tool.url ? 'https://image.thum.io/get/width/640/crop/360/' + tool.url.replace('https://', '') : '';
  return [
    '  {',
    '    _id: "site-' + tool.siteKey + '",',
    '    userId: "00000000000000000",',
    '    siteKey: "' + tool.siteKey + '",',
    '    url: "' + tool.url + '",',
    '    name: "' + (tool.name || '').replace(/"/g, '\\"') + '",',
    '    icon: "' + (tool.icon || '') + '",',
    '    subCategory: "' + ((tool.categories && tool.categories[0]) || '') + '",',
    '    featured: false,',
    '    weight: 50,',
    '    snapshot: "' + snapshot + '",',
    '    description: "' + (tool.description || '').replace(/"/g, '\\"').replace(/\n/g, ' ').substring(0, 300) + '",',
    '    pricingType: "' + (tool.pricingType || '免费增值') + '",',
    '    categories: ' + JSON.stringify(tool.categories || []) + ',',
    '    images: [],',
    '    features: ' + JSON.stringify(tool.features || []) + ',',
    '    usecases: ' + JSON.stringify(tool.usecases || []) + ',',
    '    users: ' + JSON.stringify(tool.users || []) + ',',
    '    relatedSearches: [],',
    '    pricings: ' + JSON.stringify(tool.pricings || []) + ',',
    '    links: {},',
    '    voteCount: ' + (tool.voteCount || 50) + ',',
    '    metaKeywords: [],',
    '    metaDescription: "",',
    '    searchSuggestWords: [],',
    '    state: SiteState.published,',
    '    processStage: ProcessStage.success,',
    '    createdAt: ' + Date.now() + ',',
    '    updatedAt: ' + Date.now() + ',',
    '  }'
  ].join('\n');
}

const entries = newTools.map(tool => toSiteEntry(tool)).join(',\n');

// Find the SEED_SITES array closing
// Pattern: ];\nexport (or end of file)
const closeIdx = seed.lastIndexOf('];\nexport');
const altCloseIdx = seed.lastIndexOf('];\n\nexport');

let insertAt;
if (closeIdx !== -1) insertAt = closeIdx;
else if (altCloseIdx !== -1) insertAt = altCloseIdx;
else {
  // Fallback: find last ]; before export functions
  const lastArrayClose = seed.lastIndexOf('];');
  console.log('Using fallback, last ]; at:', lastArrayClose);
  console.log('Context:', seed.substring(lastArrayClose - 10, lastArrayClose + 50));
  insertAt = lastArrayClose;
}

const newSeed = seed.substring(0, insertAt) + ',\n' + entries + '\n' + seed.substring(insertAt);

fs.writeFileSync(seedPath, newSeed, 'utf8');
console.log('Written', newTools.length, 'new tools to seed-data.ts');
console.log('New total siteKeys:', existingKeys.length + newTools.length);
