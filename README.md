# 家谱小程序 - 微信云开发版

## 功能特性
- 📱 家谱树状视图（缩放拖拽）
- 👥 成员信息管理（增删改查）
- 🌙 深色主题切换
- ☁️ 微信云开发后端（数据库+云函数）

## 快速开始

### 1. 创建云开发环境
1. 在微信开发者工具中打开项目
2. 点击"云开发" → "开通云开发"
3. 创建环境，记录环境ID
4. 修改 `app.js` 中的 `env: 'your-env-id'`

### 2. 部署云函数
```bash
# 右键 cloudfunctions/addMember → 上传并部署
# 右键 cloudfunctions/getMembers → 上传并部署
```

### 3. 创建数据库集合
在云开发控制台创建集合：
- `members` - 存储家谱成员信息

### 4. 数据库权限
设置 `members` 集合权限为：
- 创建：仅创建者可写
- 读取：所有用户可读

## 数据模型

### members 集合
```javascript
{
  _id: "auto",
  name: "张三",           // 姓名
  gender: "男",           // 性别
  birthYear: "1990",      // 出生年
  location: "浙江 杭州",   // 籍贯
  generation: 3,          // 世代
  familyId: "default",    // 家族ID
  createTime: Date,       // 创建时间
  updateTime: Date,       // 更新时间
  creator: "openid"       // 创建者
}
```

## 目录结构
```
├── pages/              # 页面
├── cloudfunctions/     # 云函数
├── styles/            # 样式令牌
└── app.js             # 小程序入口
```

## 开发说明
- 使用微信云开发作为后端服务
- 支持真机预览（绕过基础库下载问题）
- 深色主题通过 CSS 变量实现