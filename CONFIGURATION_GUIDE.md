# AigoTools 配置指南

## 一、安全配置

### 1.1 密码安全
**⚠️ 重要：请勿使用默认密码！**

建议使用以下方式生成安全密码：
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(24))
```

### 1.2 环境变量配置步骤

1. **复制模板文件**：
   ```bash
   cp packages/aigotools/.env.example packages/aigotools/.env.local
   cp packages/crawler/.env.example packages/crawler/.env.local
   
   # 生产环境
   cp packages/aigotools/.env.example packages/aigotools/.env.prod
   cp packages/crawler/.env.example packages/crawler/.env.prod
   ```

2. **修改关键配置**：
   - MongoDB密码
   - Redis密码
   - MinIO访问密钥
   - Clerk认证密钥
   - API密钥（OpenAI、Jina AI）

## 二、配置统一化

### 2.1 MinIO配置
确保以下配置在两个服务中保持一致：

| 配置项 | 推荐值 | 说明 |
|--------|--------|------|
| MINIO_ENDPOINT | localhost | 本地部署使用localhost |
| MINIO_BUCKET | aigotools | 统一Bucket名称 |
| MINIO_ACCESS_KEY | 自定义 | 从MinIO管理后台获取 |
| MINIO_SECERT_KEY | 自定义 | 从MinIO管理后台获取 |

### 2.2 服务连接配置
```env
# aigotools/.env
CRAWLER_GATEWAY=http://localhost:13000
CRAWLER_AUTH_USER=admin
CRAWLER_AUTH_PASSWORD=your_password

# crawler/.env
AUTH_USER=admin
AUTH_PASSWORD=your_password
```

## 三、部署检查清单

### 3.1 本地部署前检查
- [ ] 已修改所有默认密码
- [ ] 已配置API密钥（OpenAI、Jina AI）
- [ ] 已配置Clerk认证
- [ ] 已统一MinIO配置
- [ ] 已检查端口占用（3000, 13000, 27017, 6379, 9000, 9001）

### 3.2 生产环境检查
- [ ] 使用HTTPS协议
- [ ] 配置CORS策略
- [ ] 启用数据库认证
- [ ] 配置防火墙规则
- [ ] 设置监控和日志

## 四、常见问题解决

### 4.1 MinIO连接失败
**症状**：图片无法上传或显示
**解决**：
1. 检查MinIO服务状态：`docker ps | grep minio`
2. 验证Bucket权限：确保Bucket已开启公开读权限
3. 检查网络连接：确保服务间网络可达

### 4.2 MongoDB认证失败
**症状**：数据无法保存
**解决**：
1. 检查连接字符串格式
2. 验证用户名密码
3. 检查认证数据库（authSource）

### 4.3 Crawler服务不可用
**症状**：网站收录功能失效
**解决**：
1. 检查Crawler服务状态
2. 验证API密钥有效性
3. 检查网络代理设置

## 五、性能优化建议

### 5.1 数据库索引
为常用查询字段添加索引：
```javascript
// MongoDB索引示例
db.sites.createIndex({ category: 1, status: 1 })
db.sites.createIndex({ createdAt: -1 })
```

### 5.2 缓存策略
- 使用Redis缓存热门网站数据
- 实现CDN加速静态资源
- 启用浏览器缓存

### 5.3 监控指标
- 响应时间：< 200ms
- 错误率：< 0.1%
- 并发连接数：根据实际需求调整

## 六、安全建议

### 6.1 API密钥管理
- 使用环境变量存储密钥
- 定期轮换密钥
- 限制API调用频率

### 6.2 数据保护
- 启用数据库加密
- 定期备份数据
- 实施访问控制

### 6.3 网络安全
- 使用HTTPS
- 配置WAF
- 实施DDoS防护

---

**最后更新**：2024年5月24日
**版本**：1.0.0