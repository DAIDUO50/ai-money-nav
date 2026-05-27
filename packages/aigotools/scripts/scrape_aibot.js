const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Categories to scrape from ai-bot.cn
const categories = [
  { name: 'AI写作工具', url: 'https://ai-bot.cn/favorites/ai-writing-tools/', category: 'AI写作' },
  { name: 'AI图像工具', url: 'https://ai-bot.cn/favorites/ai-image-tools/', category: 'AI绘图' },
  { name: 'AI视频工具', url: 'https://ai-bot.cn/favorites/ai-video-tools/', category: 'AI视频' },
  { name: 'AI办公工具', url: 'https://ai-bot.cn/favorites/ai-office-tools/', category: 'AI办公' },
  { name: 'AI智能体', url: 'https://ai-bot.cn/favorites/ai-agent/', category: 'AI开发' },
  { name: 'AI聊天助手', url: 'https://ai-bot.cn/favorites/ai-chatbots/', category: 'AI对话' },
  { name: 'AI编程工具', url: 'https://ai-bot.cn/favorites/ai-programming-tools/', category: 'AI编程' },
  { name: 'AI设计工具', url: 'https://ai-bot.cn/favorites/ai-design-tools/', category: 'AI绘图' },
  { name: 'AI音频工具', url: 'https://ai-bot.cn/favorites/ai-audio-tools/', category: 'AI音频' },
  { name: 'AI搜索引擎', url: 'https://ai-bot.cn/favorites/ai-search-engines/', category: 'AI对话' },
  { name: 'AI开发平台', url: 'https://ai-bot.cn/favorites/ai-frameworks/', category: 'AI开发' },
  { name: 'AI学习网站', url: 'https://ai-bot.cn/favorites/websites-to-learn-ai/', category: 'AI教育' },
  { name: 'AI提示指令', url: 'https://ai-bot.cn/favorites/ai-prompt-tools/', category: 'AI编程' }
];

// Helper: generate siteKey from name
function generateSiteKey(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper: random number between min and max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper: random rating between 3.5 and 5.0
function randomRating() {
  return (Math.random() * 1.5 + 3.5).toFixed(1);
}

// Helper: extract features from description
function extractFeatures(description) {
  const keywords = [];
  const desc = description.toLowerCase();
  
  if (desc.includes('写作') || desc.includes('write') || desc.includes('文本')) keywords.push('智能写作');
  if (desc.includes('图像') || desc.includes('image') || desc.includes('图片')) keywords.push('图像生成');
  if (desc.includes('视频') || desc.includes('video')) keywords.push('视频制作');
  if (desc.includes('编程') || desc.includes('code') || desc.includes('代码')) keywords.push('代码辅助');
  if (desc.includes('聊天') || desc.includes('chat') || desc.includes('对话')) keywords.push('智能对话');
  if (desc.includes('翻译') || desc.includes('translate')) keywords.push('多语言翻译');
  if (desc.includes('搜索') || desc.includes('search')) keywords.push('智能搜索');
  if (desc.includes('设计') || desc.includes('design')) keywords.push('创意设计');
  if (desc.includes('音频') || desc.includes('audio') || desc.includes('音乐')) keywords.push('音频处理');
  if (desc.includes('办公') || desc.includes('office')) keywords.push('办公自动化');
  
  // Ensure we have 2-4 features
  if (keywords.length < 2) {
    keywords.push('AI驱动', '智能辅助');
  }
  
  return keywords.slice(0, 4);
}

// Helper: get usecases based on category
function getUsecases(category) {
  const usecaseMap = {
    'AI写作': ['内容创作', '文案撰写', '文章润色'],
    'AI绘图': ['创意设计', '图像生成', '艺术创作'],
    'AI视频': ['视频制作', '内容创作', '营销推广'],
    'AI办公': ['文档处理', '效率提升', '团队协作'],
    'AI开发': ['应用开发', 'API集成', '工作流自动化'],
    'AI对话': ['智能客服', '问答助手', '内容创作'],
    'AI编程': ['代码生成', '调试辅助', '学习编程'],
    'AI音频': ['音乐创作', '语音合成', '音频编辑'],
    'AI教育': ['在线学习', '知识问答', '技能培训']
  };
  
  return usecaseMap[category] || ['AI辅助', '效率提升', '创意生成'];
}

// Helper: get users based on category
function getUsers(category) {
  const userMap = {
    'AI写作': ['自媒体人', '文案策划', '内容创作者'],
    'AI绘图': ['设计师', '艺术家', '创意工作者'],
    'AI视频': ['视频创作者', '营销人员', '自媒体'],
    'AI办公': ['上班族', '企业用户', '项目经理'],
    'AI开发': ['开发者', '产品经理', '技术团队'],
    'AI对话': ['客服人员', '销售人员', '普通用户'],
    'AI编程': ['程序员', '学生', '技术爱好者'],
    'AI音频': ['音乐人', '播客主', '音频工程师'],
    'AI教育': ['学生', '教师', '终身学习者']
  };
  
  return userMap[category] || ['AI爱好者', '专业人士', '创业者'];
}

// Helper: determine pricing type from description
function getPricingType(description) {
  const desc = description.toLowerCase();
  if (desc.includes('免费') || desc.includes('free')) return '免费';
  if (desc.includes('付费') || desc.includes('premium') || desc.includes('pro')) return '付费';
  return '免费增值';
}

// Helper: generate pricings based on pricingType
function generatePricings(pricingType) {
  if (pricingType === '免费') return ['免费版'];
  if (pricingType === '付费') return ['基础版 ¥99/月', '专业版 ¥299/月'];
  return ['免费版', 'Pro版 ¥199/月', '企业版 ¥999/月'];
}

// Scrape a single category
async function scrapeCategory(page, category) {
  console.log(`Scraping: ${category.name} (${category.url})`);
  
  try {
    await page.goto(category.url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for dynamic content
    
    // Extract tool cards
    const tools = await page.evaluate(() => {
      const results = [];
      
      // Try multiple selectors for tool cards
      const selectors = [
        '.favorites-item',
        '.tool-card',
        '.item',
        'article',
        '.post',
        'a[href*="http"]'
      ];
      
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          elements.forEach((el, index) => {
            if (index >= 50) return; // Limit to 50 per category
            
            let name = '';
            let url = '';
            let description = '';
            
            // Extract name
            const nameEl = el.querySelector('h2, h3, .title, .name') || el;
            if (nameEl) name = nameEl.textContent?.trim() || '';
            
            // Extract URL
            const linkEl = el.querySelector('a') || el;
            if (linkEl && linkEl.href) {
              url = linkEl.href;
            } else if (el.href) {
              url = el.href;
            }
            
            // Extract description
            const descEl = el.querySelector('.description, .excerpt, p, .summary');
            if (descEl) description = descEl.textContent?.trim() || '';
            
            if (name && url) {
              results.push({ name, url, description });
            }
          });
          
          if (results.length > 0) break;
        }
      }
      
      return results;
    });
    
    console.log(`  Found ${tools.length} tools`);
    
    // Convert to Site format
    const sites = tools.map((tool, index) => {
      const siteKey = generateSiteKey(tool.name);
      const pricingType = getPricingType(tool.description);
      
      return {
        _id: `site-${siteKey}`,
        userId: '00000000000000000',
        siteKey: siteKey,
        url: tool.url,
        name: tool.name,
        icon: `logos:${siteKey}`,
        subCategory: category.category,
        featured: index < 5, // First 5 are featured
        weight: 100 - index,
        snapshot: `https://image.thum.io/get/width/640/crop/360/${tool.url}`,
        description: tool.description || `${tool.name} - AI工具`,
        pricingType: pricingType,
        categories: [category.category],
        images: [],
        features: extractFeatures(tool.description),
        usecases: getUsecases(category.category),
        users: getUsers(category.category),
        relatedSearches: [tool.name, category.category, 'AI工具'],
        pricings: generatePricings(pricingType),
        links: {},
        voteCount: randomInt(10, 200),
        metaKeywords: [tool.name, category.category, 'AI'],
        metaDescription: `${tool.name} - ${tool.description || 'AI工具'}`,
        searchSuggestWords: [siteKey, tool.name.toLowerCase()],
        state: 'published',
        processStage: 'success',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
    });
    
    return sites;
    
  } catch (error) {
    console.error(`  Error scraping ${category.name}:`, error.message);
    return [];
  }
}

// Main function
async function main() {
  console.log('Starting scraper...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const allSites = [];
  const stats = {};
  
  for (const category of categories) {
    const sites = await scrapeCategory(page, category);
    allSites.push(...sites);
    stats[category.name] = sites.length;
    
    // Be polite, wait between requests
    await page.waitForTimeout(2000 + Math.random() * 1000);
  }
  
  await browser.close();
  
  // Save to JSON
  const outputPath = path.join(__dirname, 'aibot_tools.json');
  fs.writeFileSync(outputPath, JSON.stringify(allSites, null, 2), 'utf8');
  
  console.log('\n=== Scraping Complete ===');
  console.log(`Total tools scraped: ${allSites.length}`);
  console.log('Breakdown by category:');
  for (const [cat, count] of Object.entries(stats)) {
    console.log(`  ${cat}: ${count} tools`);
  }
  console.log(`\nData saved to: ${outputPath}`);
}

main().catch(console.error);
