# Zeabur托管服务部署AigoTools

## 目录
1. [前置准备](#1-前置准备)
2. [创建项目和服务](#2-创建项目和服务)
3. [配置MinIO](#3-配置minio)
4. [配置网络域名](#4-配置网络域名)
5. [配置Crawler环境变量](#5-配置crawler环境变量)
6. [配置Main服务环境变量](#6-配置main服务环境变量)
7. [部署与验证](#7-部署与验证)
8. [故障排除](#8-故障排除)

## 1. 前置准备

- 在 https://clerk.com/ 上创建一个application，并创建一个用户。获取到application的API Keys和用户的userID。
- 确保已有可用的 OpenAI API Key 和 Jina AI API Key。

## 2. 创建项目和服务

在Zeabur上创建一个新项目，可以使用以下两种方式：

### 方式一：从模板创建（推荐）
直接通过下面的模板创建项目：
[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/9PSGFO?referralCode=someu)

### 方式二：手动添加服务
在项目中逐个添加下面的服务：

1. **aigotools-main**：从 `https://github.com/someu/aigotools` 仓库中添加，根目录填 `packages/aigotools`。
2. **aigotools-crawler**：从同一仓库中添加，根目录填 `packages/crawler`。
3. **Redis**：从预构建镜像中添加。
4. **MongoDB**：从预构建镜像中添加。
5. **MinIO**：从预构建镜像中添加。

## 3. 配置MinIO

1. 为MinIO的Web控制台和API生成对应的域名：
   - Web端域名：用于访问图片（如 `https://aigotools-images.zeabur.app`）
   - Console端域名：用于管理MinIO控制台

2. 从Zeabur环境变量中查看MinIO的用户名和密码。

3. 使用Console端域名登录MinIO管理后台。

4. 在管理后台中创建 `images` bucket用于存储图片。

5. 配置该bucket的匿名访问模式为**可读**（Public Read）。

6. 生成一个Access Key和Secret Key（在MinIO管理后台 -> Access Keys中创建）。

## 4. 配置网络域名

为aigotools-main服务配置网络，生成一个域名（或自定义域名），该域名即为AigoTools服务的访问地址。

## 5. 配置Crawler环境变量

在aigotools-crawler服务的环境变量中配置：

```env
# ===== 默认配置（无需修改）=====
PORT=13000
IMAGE_STORAGE=minio
REDIS_HOST=redis.zeabur.internal
REDIS_PORT=6379
REDIS_DB=0
MINIO_PORT=9000
REDIS_PASS=${REDIS_PASSWORD}
MONGODB_URI=${MONGO_CONNECTION_STRING}
MINIO_ENDPOINT=minio.zeabur.internal
MINIO_BUCKET=images

# ===== 需要自行配置的部分 =====

# OpenAI 配置
OPENAI_BASEURL=https://api.openai.com/v1
OPENAI_KEY=你的OpenAI_API_Key
OPENAI_MODEL=gpt-4o

# Jina AI 配置
JINA_API_KEY=你的Jina_API_Key

# MinIO 服务Web端请求base地址
MINIO_BASE=https://aigotools-images.zeabur.app
# MinIO Access Key（从第3步MinIO管理后台获取）
MINIO_ACCESS_KEY=你的MinIO_Access_Key
# MinIO Secret Key（从第3步MinIO管理后台获取）
MINIO_SECERT_KEY=你的MinIO_Secret_Key

# Crawler服务Basic认证（自行设置）
AUTH_USER=admin
AUTH_PASSWORD=你的安全密码
```

## 6. 配置Main服务环境变量

在aigotools-main服务的环境变量中配置：

```env
# ===== 默认配置（无需修改）=====
CRAWLER_GATEWAY=http://aigotools-crawler.zeabur.internal:8080
MONGODB_URI=${MONGO_CONNECTION_STRING}
MINIO_ENDPOINT=minio.zeabur.internal
NEXT_PUBLIC_IMAGE_STORAGE=minio
MINIO_BUCKET=images
MINIO_PORT=9000

# ===== 需要自行配置的部分 =====

# 网站地址
NEXT_PUBLIC_APP_URL=https://你的域名.zeabur.app

# Clerk 配置
CLERK_SECRET_KEY=你的Clerk_Secret_Key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=你的Clerk_Publishable_Key

# MinIO 配置
MINIO_BASE=https://aigotools-images.zeabur.app
MINIO_ACCESS_KEY=你的MinIO_Access_Key
MINIO_SECERT_KEY=你的MinIO_Secret_Key

# 后台管理员ID（Clerk用户ID）
NEXT_PUBLIC_MANAGER_USER=你的Clerk_User_ID

# 网站信息
NEXT_PUBLIC_APP_NAME=AI导航
NEXT_PUBLIC_APP_GENERATOR=网站作者名称
NEXT_PUBLIC_APP_GENERATOR_URL=https://你的个人网站

# Crawler认证（需与Crawler服务配置一致）
CRAWLER_AUTH_USER=admin
CRAWLER_AUTH_PASSWORD=你的安全密码
```

## 7. 部署与验证

1. 保存所有环境变量后，重新部署aigotools-main和aigotools-crawler服务。
2. 访问aigotools-main的域名，确认网站正常运行。
3. 使用Clerk管理员账号登录后台，测试网站管理功能。
4. 测试图片上传和展示功能。

## 8. 故障排除

### 网站无法访问
- 检查服务是否全部启动成功
- 检查aigotools-main的环境变量是否配置正确
- 查看Zeabur部署日志

### 图片上传失败
- 确认MinIO服务正常运行
- 检查MinIO bucket权限是否为公开读取
- 验证MINIO_ACCESS_KEY和MINIO_SECERT_KEY是否正确

### Crawler服务不可用
- 检查Crawler服务是否正常运行
- 验证OPENAI_KEY和JINA_API_KEY是否有效
- 确保Crawler和Main服务之间的认证凭据一致