#!/usr/bin/env node
/**
 * Generate AI tools data and append to seed-data.ts
 */

const fs = require('fs');
const path = require('path');

// Comprehensive AI tools data
const aiToolsData = {
  "AI写作": [
    { name: "ChatGPT", url: "https://chat.openai.com", desc: "OpenAI开发的AI对话模型，支持多语言对话、写作、编程等" },
    { name: "Claude", url: "https://claude.ai", desc: "Anthropic开发的AI助手，擅长长文本分析和写作" },
    { name: "Notion AI", url: "https://notion.ai", desc: "集成在Notion中的AI写作助手" },
    { name: "Jasper AI", url: "https://jasper.ai", desc: "专业的AI营销文案写作工具" },
    { name: "Copy.ai", url: "https://copy.ai", desc: "AI文案生成工具，支持多种营销场景" },
    { name: "Writesonic", url: "https://writesonic.com", desc: "AI写作平台，支持博客、广告、邮件等" },
    { name: "Rytr", url: "https://rytr.me", desc: "经济实惠的AI写作助手" },
    { name: "Frase", url: "https://frase.io", desc: "SEO优化的AI内容写作工具" },
    { name: "Sudowrite", url: "https://www.sudowrite.com", desc: "专为小说家设计的AI写作工具" },
    { name: "Wordtune", url: "https://www.wordtune.com", desc: "AI驱动的文本改写和润色工具" },
    { name: "INK Editor", url: "https://inkforall.com", desc: "SEO和内容优化的AI写作工具" },
    { name: "Peppertype.ai", url: "https://www.peppertype.ai", desc: "AI内容生成平台" },
    { name: "Kuki", url: "https://kuki.ai", desc: "对话式AI写作助手" },
    { name: "Hypotenuse AI", url: "https://www.hypotenuse.ai", desc: "电商和产品描述的AI写作工具" },
    { name: "Thundercontent", url: "https://thundercontent.com", desc: "AI驱动的内容创作平台" },
    { name: "Copysmith", url: "https://copysmith.ai", desc: "电商和营销AI文案工具" },
    { name: "Articoolo", url: "https://www.articoolo.com", desc: "AI文章生成工具" },
    { name: "AI Writer", url: "https://ai-writer.com", desc: "基于AI的文章和博客写作工具" },
    { name: "Textio", url: "https://textio.com", desc: "招聘文案优化的AI工具" },
    { name: "Grammarly", url: "https://grammarly.com", desc: "AI语法检查和写作改进工具" }
  ],
  
  "AI绘图": [
    { name: "Midjourney", url: "https://midjourney.com", desc: "高质量的AI图像生成工具，通过Discord使用" },
    { name: "DALL-E 3", url: "https://openai.com/dall-e-3", desc: "OpenAI开发的图像生成模型" },
    { name: "Stable Diffusion", url: "https://stability.ai", desc: "开源的AI图像生成模型" },
    { name: "Leonardo.ai", url: "https://leonardo.ai", desc: "易于使用的AI艺术生成平台" },
    { name: "Adobe Firefly", url: "https://firefly.adobe.com", desc: "Adobe推出的AI创意生成工具" },
    { name: "Canva AI", url: "https://canva.com", desc: "Canva集成的AI图像生成功能" },
    { name: "Ideogram", url: "https://ideogram.ai", desc: "能准确渲染文字的AI图像生成工具" },
    { name: "Playground AI", url: "https://playgroundai.com", desc: "免费的AI图像创作平台" },
    { name: "DreamStudio", url: "https://beta.dreamstudio.ai", desc: "Stability AI的官方图像生成平台" },
    { name: "NightCafe", url: "https://nightcafe.studio", desc: "流行的AI艺术生成社区" },
    { name: "StarryAI", url: "https://starryai.com", desc: "移动端友好的AI艺术生成工具" },
    { name: "Artbreeder", url: "https://www.artbreeder.com", desc: "基于GAN的图像混合和生成平台" },
    { name: "Deep Dream Generator", url: "https://deepdreamgenerator.com", desc: "Google Deep Dream技术的在线应用" },
    { name: "Runway ML", url: "https://runwayml.com", desc: "创意AI工具，支持图像和视频生成" },
    { name: "Fotor", url: "https://www.fotor.com", desc: "在线图片编辑和AI图像生成" },
    { name: "Picsart AI", url: "https://picsart.com", desc: "移动端AI图像编辑和生成" },
    { name: "Shutterstock AI", url: "https://www.shutterstock.com/ai-image-generator", desc: "图库平台推出的AI图像生成" },
    { name: "Getty Images AI", url: "https://www.gettyimages.com", desc: "Getty推出的商用AI图像生成" },
    { name: "Midjourney Alternative", url: "https://www.midjourneyalternative.com", desc: "Midjourney的替代方案集合" },
    { name: "BlueWillow", url: "https://www.bluewillowai.com", desc: "免费的Discord AI图像生成机器人" }
  ],
  
  "AI视频": [
    { name: "Runway Gen-2", url: "https://runwayml.com", desc: "专业的AI视频生成和编辑平台" },
    { name: "Pika Art", url: "https://pika.art", desc: "AI视频生成工具，支持文本到视频" },
    { name: "Sora", url: "https://openai.com/sora", desc: "OpenAI推出的文本到视频生成模型" },
    { name: "HeyGen", url: "https://heygen.com", desc: "AI数字人和视频翻译平台" },
    { name: "Synthesia", url: "https://synthesia.io", desc: "AI数字人视频生成平台" },
    { name: "D-ID", url: "https://www.d-id.com", desc: "AI驱动的照片说话视频生成" },
    { name: "Pictory", url: "https://pictory.ai", desc: "AI视频摘要和制作工具" },
    { name: "InVideo AI", url: "https://invideo.io", desc: "文本到视频的AI生成平台" },
    { name: "Fliki", url: "https://fliki.ai", desc: "文本到视频带AI配音的工具" },
    { name: "Kapwing AI", url: "https://www.kapwing.com", desc: "在线视频编辑与AI功能" },
    { name: "Descript", url: "https://www.descript.com", desc: "基于文本的视频编辑工具" },
    { name: "Wondershare Filmora", url: "https://filmora.wondershare.net", desc: "集成AI功能的视频编辑软件" },
    { name: "Lumen5", url: "https://lumen5.com", desc: "博客文章转视频的AI工具" },
    { name: "FlexClip", url: "https://www.flexclip.com", desc: "在线AI视频制作平台" },
    { name: "Veed.io", url: "https://www.veed.io", desc: "在线视频编辑与AI字幕" },
    { name: "RawShorts", url: "https://www.rawshorts.com", desc: "AI动画视频制作工具" },
    { name: "Elai.io", url: "https://elai.io", desc: "AI数字人视频生成" },
    { name: "Colossyan", url: "https://www.colossyan.com", desc: "企业培训视频AI生成" },
    { name: "Ssemble", url: "https://ssemble.com", desc: "在线协作视频编辑器" },
    { name: "Wisecut", url: "https://wisecut.video", desc: "AI视频剪辑和跳跃剪辑工具" }
  ],
  
  "AI对话": [
    { name: "ChatGPT", url: "https://chat.openai.com", desc: "OpenAI的对话AI，最流行的AI聊天助手" },
    { name: "Claude", url: "https://claude.ai", desc: "Anthropic的AI助手，擅长安全和长对话" },
    { name: "Gemini", url: "https://gemini.google.com", desc: "Google推出的多模态AI助手" },
    { name: "Character.ai", url: "https://character.ai", desc: "创建和对话各种AI角色的平台" },
    { name: "Replika", url: "https://replika.com", desc: "AI陪伴和心理健康聊天机器人" },
    { name: "YouChat", url: "https://you.com", desc: "集成搜索的AI聊天助手" },
    { name: "Perplexity AI", url: "https://www.perplexity.ai", desc: "AI搜索和问答平台" },
    { name: "Pi", url: "https://pi.ai", desc: "Inflection AI开发的个人AI助手" },
    { name: "HuggingChat", url: "https://huggingface.co/chat", desc: "HuggingFace的开源聊天界面" },
    { name: "Poe", url: "https://poe.com", desc: "Quora推出的多模型AI聊天平台" },
    { name: "Bard", url: "https://bard.google.com", desc: "Google Bard（现Gemini）" },
    { name: "Bing Chat", url: "https://www.bing.com/chat", desc: "微软Bing集成的AI聊天" },
    { name: "Ernie Bot", url: "https://yiyan.baidu.com", desc: "百度推出的中文AI对话模型" },
    { name: "Tongyi Qianwen", url: "https://tongyi.aliyun.com", desc: "阿里云的通义千问AI助手" },
    { name: "Doubao", url: "https://www.doubao.com", desc: "字节跳动推出的AI对话助手" },
    { name: "Kimi", url: "https://kimi.moonshot.cn", desc: "月之暗面推出的长文本AI助手" },
    { name: "ChatGLM", url: "https://chatglm.cn", desc: "清华ChatGLM中文对话模型" },
    { name: "iFlytek Spark", url: "https://xinghuo.xfyun.cn", desc: "科大讯飞星火认知大模型" },
    { name: "Tencent Hunyuan", url: "https://hunyuan.tencent.com", desc: "腾讯混元大模型" },
    { name: "SenseChat", url: "https://seneschat.com", desc: "商汤科技SenseChat大模型" }
  ],
  
  "AI编程": [
    { name: "GitHub Copilot", url: "https://github.com/features/copilot", desc: "GitHub和OpenAI合作的AI代码助手" },
    { name: "Cursor", url: "https://cursor.sh", desc: "AI原生的代码编辑器" },
    { name: "Codeium", url: "https://codeium.com", desc: "免费的AI代码补全工具" },
    { name: "Tabnine", url: "https://tabnine.com", desc: "AI代码补全和聊天助手" },
    { name: "Amazon CodeWhisperer", url: "https://aws.amazon.com/codewhisperer", desc: "AWS推出的AI编程助手" },
    { name: "Replit Ghostwriter", url: "https://replit.com", desc: "Replit集成的AI编程助手" },
    { name: "CodeT5", url: "https://github.com/salesforce/CodeT5", desc: "Salesforce开源的代码生成模型" },
    { name: "StarCoder", url: "https://huggingface.co/bigcode", desc: "BigCode社区的开源代码模型" },
    { name: "Claude for Dev", url: "https://claude.ai", desc: "Claude用于编程任务" },
    { name: "ChatGPT for Dev", url: "https://chat.openai.com", desc: "使用ChatGPT辅助编程" },
    { name: "sourcegraph Cody", url: "https://cody.sourcegraph.com", desc: "Sourcegraph的AI编程助手" },
    { name: "JetBrains AI", url: "https://www.jetbrains.com/ai", desc: "JetBrains IDE集成的AI助手" },
    { name: "Visual Studio IntelliCode", url: "https://visualstudio.microsoft.com", desc: "微软VS的AI代码建议" },
    { name: "Kite", url: "https://www.kite.com", desc: "Python AI代码补全工具" },
    { name: "Snyk Code", url: "https://snyk.io", desc: "AI驱动的代码安全扫描" },
    { name: "Mintlify", url: "https://mintlify.com", desc: "AI自动生成代码文档" },
    { name: "Stepsize", url: "https://stepsize.com", desc: "AI代码审查和重构建议" },
    { name: "WhatTheDiff", url: "https://whatthediff.ai", desc: "AI代码差异解释工具" },
    { name: "Bloop", url: "https://bloop.ai", desc: "AI代码搜索和理解工具" },
    { name: "Aider", url: "https://aider.chat", desc: "命令行AI结对编程工具" }
  ],
  
  "AI办公": [
    { name: "Notion AI", url: "https://notion.ai", desc: "Notion集成的AI助手" },
    { name: "Microsoft 365 Copilot", url: "https://www.microsoft.com/microsoft-365/copilot", desc: "微软Office集成的AI助手" },
    { name: "Google Workspace AI", url: "https://workspace.google.com", desc: "Google Workspace的AI功能" },
    { name: "Slack AI", url: "https://slack.com", desc: "Slack集成的AI搜索和摘要" },
    { name: "Zoom AI Companion", url: "https://zoom.us", desc: "Zoom会议的AI助手" },
    { name: "Grammarly Business", url: "https://grammarly.com", desc: "企业级AI写作助手" },
    { name: "Jasper for Business", url: "https://jasper.ai", desc: "企业营销内容AI生成" },
    { name: "Copy.ai for Enterprise", url: "https://copy.ai", desc: "企业级AI文案工具" },
    { name: "Fireflies.ai", url: "https://fireflies.ai", desc: "AI会议记录和摘要" },
    { name: "Otter.ai", url: "https://otter.ai", desc: "AI会议转录和摘要" },
    { name: "Clockwise", url: "https://www.getclockwise.com", desc: "AI日历优化工具" },
    { name: "Reclaim.ai", url: "https://reclaim.ai", desc: "AI日程管理和时间优化" },
    { name: "Motion", url: "https://www.usemotion.com", desc: "AI任务和时间管理" },
    { name: "Trevor AI", url: "https://trevor.ai", desc: "AI日程安排助手" },
    { name: "Todoist AI", url: "https://todoist.com", desc: "Todoist集成的AI任务管理" },
    { name: "ClickUp AI", url: "https://clickup.com", desc: "ClickUp项目管理AI助手" },
    { name: "Asana AI", url: "https://asana.com", desc: "Asana项目管理的AI功能" },
    { name: "Monday.com AI", url: "https://monday.com", desc: "Monday.com的AI工作管理" },
    { name: "Airtable AI", url: "https://airtable.com", desc: "Airtable集成的AI功能" },
    { name: "Zapier AI", url: "https://zapier.com", desc: "Zapier自动化集成的AI" }
  ],
  
  "AI开发": [
    { name: "LangChain", url: "https://www.langchain.com", desc: "LLM应用开发框架" },
    { name: "LlamaIndex", url: "https://www.llamaindex.ai", desc: "LLM数据框架" },
    { name: "Hugging Face", url: "https://huggingface.co", desc: "开源ML模型和数据集平台" },
    { name: "OpenAI API", url: "https://platform.openai.com", desc: "OpenAI的API开发平台" },
    { name: "Anthropic Claude API", url: "https://console.anthropic.com", desc: "Anthropic Claude API" },
    { name: "Google AI Studio", url: "https://ai.google.dev", desc: "Google AI开发平台" },
    { name: "Azure AI", url: "https://azure.microsoft.com/ai", desc: "微软Azure AI服务" },
    { name: "AWS Bedrock", url: "https://aws.amazon.com/bedrock", desc: "AWS的AI基础模型服务" },
    { name: "Replicate", url: "https://replicate.com", desc: "ML模型部署和运行平台" },
    { name: "Modal", url: "https://modal.com", desc: "无服务器ML基础设施" },
    { name: "Weights & Biases", url: "https://wandb.ai", desc: "ML实验跟踪和可视化" },
    { name: "MLflow", url: "https://mlflow.org", desc: "开源ML生命周期平台" },
    { name: "TensorFlow", url: "https://www.tensorflow.org", desc: "Google的ML框架" },
    { name: "PyTorch", url: "https://pytorch.org", desc: "Meta的开源ML框架" },
    { name: "JAX", url: "https://jax.readthedocs.io", desc: "Google的高性能ML框架" },
    { name: "Pinecone", url: "https://www.pinecone.io", desc: "向量数据库" },
    { name: "Weaviate", url: "https://weaviate.io", desc: "开源向量数据库" },
    { name: "Chroma", url: "https://www.trychroma.com", desc: "开源嵌入数据库" },
    { name: "Supabase", url: "https://supabase.com", desc: "开源Firebase替代，集成AI" },
    { name: "Vercel AI SDK", url: "https://sdk.vercel.ai", desc: "Vercel的AI应用开发工具包" }
  ],
  
  "AI教育": [
    { name: "Khan Academy Khanmigo", url: "https://www.khanacademy.org", desc: "Khan Academy的AI导师" },
    { name: "Duolingo Max", url: "https://www.duolingo.com", desc: "Duolingo的AI语言学习" },
    { name: "Coursera AI", url: "https://www.coursera.org", desc: "Coursera的AI课程推荐" },
    { name: "edX", url: "https://www.edx.org", desc: "在线学习平台的AI功能" },
    { name: "Quizlet AI", url: "https://quizlet.com", desc: "Quizlet的AI学习工具" },
    { name: "Socratic", url: "https://socratic.org", desc: "Google的AI学习助手" },
    { name: "Photomath", url: "https://photomath.com", desc: "AI数学解题工具" },
    { name: "Wolfram Alpha", url: "https://www.wolframalpha.com", desc: "计算知识引擎" },
    { name: "Brilliant", url: "https://brilliant.org", desc: "互动数学和科学学习" },
    { name: "MasterClass", url: "https://www.masterclass.com", desc: "名人授课的在线学习平台" },
    { name: "Skillshare", url: "https://www.skillshare.com", desc: "创意技能学习平台" },
    { name: "Udemy AI", url: "https://www.udemy.com", desc: "Udemy的AI课程" },
    { name: "Grammarly", url: "https://grammarly.com", desc: "AI写作学习工具" },
    { name: "DeepL Write", url: "https://www.deepl.com/write", desc: "AI写作改进工具" },
    { name: "Elicit", url: "https://elicit.org", desc: "AI研究助手" },
    { name: "Consensus", url: "https://consensus.app", desc: "AI学术搜索" },
    { name: "Perplexity for Research", url: "https://www.perplexity.ai", desc: "AI研究和问答" },
    { name: "Mubic", url: "https://www.mubic.com", desc: "AI音乐学习" },
    { name: "Yousician", url: "https://yousician.com", desc: "AI音乐教学" },
    { name: "Code.org AI", url: "https://code.org", desc: "AI编程教育" }
  ]
};

// Helper functions
function generateSiteKey(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '');
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRating() {
  return (Math.random() * 1.5 + 3.5).toFixed(1);
}

function extractFeatures(desc) {
  const features = [];
  const d = desc.toLowerCase();
  
  if (d.includes('写作') || d.includes('write') || d.includes('文本')) features.push('智能写作');
  if (d.includes('图像') || d.includes('image') || d.includes('图片')) features.push('图像生成');
  if (d.includes('视频') || d.includes('video')) features.push('视频制作');
  if (d.includes('编程') || d.includes('code') || d.includes('代码')) features.push('代码辅助');
  if (d.includes('聊天') || d.includes('chat') || d.includes('对话')) features.push('智能对话');
  if (d.includes('翻译') || d.includes('translate')) features.push('多语言翻译');
  if (d.includes('搜索') || d.includes('search')) features.push('智能搜索');
  if (d.includes('设计') || d.includes('design')) features.push('创意设计');
  if (d.includes('音频') || d.includes('audio') || d.includes('音乐')) features.push('音频处理');
  if (d.includes('办公') || d.includes('office')) features.push('办公自动化');
  
  if (features.length < 2) {
    features.push('AI驱动', '智能辅助');
  }
  
  return features.slice(0, 4);
}

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

function getPricingType(desc) {
  const d = desc.toLowerCase();
  if (d.includes('免费') || d.includes('free')) return '免费';
  if (d.includes('付费') || d.includes('premium') || d.includes('pro')) return '付费';
  return '免费增值';
}

function generatePricings(pricingType) {
  if (pricingType === '免费') return ['免费版'];
  if (pricingType === '付费') return ['基础版 ¥99/月', '专业版 ¥299/月'];
  return ['免费版', 'Pro版 ¥199/月', '企业版 ¥999/月'];
}

// Generate sites array
const allSites = [];
const now = Date.now();

for (const [category, tools] of Object.entries(aiToolsData)) {
  tools.forEach((tool, idx) => {
    const siteKey = generateSiteKey(tool.name);
    const pricingType = getPricingType(tool.desc);
    
    const site = {
      _id: `site-${siteKey}`,
      userId: '00000000000000000',
      siteKey: siteKey,
      url: tool.url,
      name: tool.name,
      icon: `logos:${siteKey}`,
      subCategory: category,
      featured: idx < 5,
      weight: 100 - idx,
      snapshot: `https://image.thum.io/get/width/640/crop/360/${tool.url}`,
      description: tool.desc,
      pricingType: pricingType,
      categories: [category],
      images: [],
      features: extractFeatures(tool.desc),
      usecases: getUsecases(category),
      users: getUsers(category),
      relatedSearches: [tool.name, category, 'AI工具'],
      pricings: generatePricings(pricingType),
      links: {},
      voteCount: randomInt(10, 200),
      metaKeywords: [tool.name, category, 'AI'],
      metaDescription: `${tool.name} - ${tool.desc}`,
      searchSuggestWords: [siteKey, tool.name.toLowerCase()],
      state: 'published',
      processStage: 'success',
      createdAt: now,
      updatedAt: now
    };
    
    allSites.push(site);
  });
}

// Output statistics
console.log('=== AI Tools Generation Complete ===');
console.log(`Total tools generated: ${allSites.length}`);
console.log('Breakdown by category:');
for (const [category, tools] of Object.entries(aiToolsData)) {
  console.log(`  ${category}: ${tools.length} tools`);
}

// Save to JSON
const outputPath = path.join(__dirname, 'aibot_tools.json');
fs.writeFileSync(outputPath, JSON.stringify(allSites, null, 2), 'utf8');
console.log(`\nData saved to: ${outputPath}`);

// Generate TypeScript code
const tsCode = allSites.map(site => {
  return `  {
    _id: "${site._id}",
    userId: "${site.userId}",
    siteKey: "${site.siteKey}",
    url: "${site.url}",
    name: "${site.name}",
    icon: "${site.icon}",
    subCategory: "${site.subCategory}",
    featured: ${site.featured},
    weight: ${site.weight},
    snapshot: "${site.snapshot}",
    description: ${JSON.stringify(site.description)},
    pricingType: "${site.pricingType}",
    categories: ${JSON.stringify(site.categories)},
    images: ${JSON.stringify(site.images)},
    features: ${JSON.stringify(site.features)},
    usecases: ${JSON.stringify(site.usecases)},
    users: ${JSON.stringify(site.users)},
    relatedSearches: ${JSON.stringify(site.relatedSearches)},
    pricings: ${JSON.stringify(site.pricings)},
    links: ${JSON.stringify(site.links)},
    voteCount: ${site.voteCount},
    metaKeywords: ${JSON.stringify(site.metaKeywords)},
    metaDescription: ${JSON.stringify(site.metaDescription)},
    searchSuggestWords: ${JSON.stringify(site.searchSuggestWords)},
    state: SiteState.published,
    processStage: ProcessStage.success,
    createdAt: ${site.createdAt},
    updatedAt: ${site.updatedAt},
  }`;
}).join(',\n');

// Save TypeScript snippet
const tsPath = path.join(__dirname, 'aibot_tools_ts_snippet.txt');
fs.writeFileSync(tsPath, tsCode, 'utf8');
console.log(`TypeScript snippet saved to: ${tsPath}`);
console.log('\n=== Next Steps ===');
console.log('1. Copy the content from aibot_tools_ts_snippet.txt');
console.log('2. Paste it into seed-data.ts before the closing ]; of SEED_SITES array');
console.log('3. Make sure to add a comma after the existing last entry');
