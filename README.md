# Festival Planner Pro

> 任何音乐节都能用的观演计划工具。**上传海报 → AI 解析 → 校对 → 标必看 / 查冲突 / 出分享图**。
>
> 这是 [Fuji Rock Planner](https://github.com/cherotichsxy-hub/fuji-rock-planner) 的「多音乐节 + 定制化」演进版。Fuji Rock 那版的所有功能（时间表视图、My Top Pick、跨日搜索、海报式分享卡）都保留；额外支持上传任意音乐节海报由 AI 自动识别成结构化时间表。

## ✨ 特性

继承自 [fuji-rock-planner](https://github.com/cherotichsxy-hub/fuji-rock-planner)：

- ★ 必看 / ? 待定 一秒标记
- 撞档自动提醒
- My Top Pick 头牌槽位（最多 3 个）
- 跨日艺人搜索
- 时间表视图（主轴 + 备选双列）
- 一键生成横版分享海报（行程式 / 时间表式）

新增：

- 📷 **上传海报识别**：拍一张海报或截图，AI（DeepSeek vision + Tesseract OCR 兜底）自动解析成 stage × 时间 × 艺人的结构化数据
- ✍️ **人工校对**：识别完先弹校对页让用户调整，再保存
- 🎫 **多音乐节**：本地保存任意张你自己的音乐节，随时切换
- 👤 **个人中心**：保存 DeepSeek API key、查看历史发布

## 🛠 技术栈

- React 19 + Vite 8（SPA，纯前端）
- html-to-image（分享图渲染）
- DeepSeek vision API（海报理解）
- Tesseract.js（OCR 兜底）
- 数据存在 localStorage，无后端

## 🚀 本地跑

```bash
git clone https://github.com/<your-username>/festival-planner-pro.git
cd festival-planner-pro
npm install
npm run dev
```

打开 `http://localhost:5173`。

## ☁️ 云端共享（可选）

默认纯本地运行。想让用户互相看到上传的音乐节、标注跨设备同步，接一个免费的 Supabase：

1. [supabase.com](https://supabase.com) 注册（GitHub 登录即可）→ New project
2. 控制台 SQL Editor → 粘贴运行 `supabase/schema.sql`（建表 + 行级安全策略）
3. 控制台 Settings → API 里拿 Project URL 和 anon key，复制 `.env.example` 为 `.env.local` 填入
4. 重启 dev server

架构上 App 只通过 `src/lib/backend.js` 一个文件访问云端（6 个函数的窄接口）。
以后要换腾讯云 CloudBase / 自建服务器，重写这一个文件即可，数据是可整体导出的普通 JSON。

隐私模型：

- 共享库人人可读，登录后才能发布；发布者只能覆盖自己发的条目（RLS 强制）
- 个人标注（想看/去过/必看/待定）存在用户自己名下，RLS 保证只有本人可读写
- **API key 默认只存设备本地、永不上传**；跨设备同步是可选项，且为端到端加密
  （用户自设同步密码在浏览器内加密后才上云，服务器与站长只见密文，无法解密）

## 🧠 关于 AI 解析

上传海报识别需要一个视觉模型的 API key（Kimi / 智谱 / 通义 / SiliconFlow / Claude / OpenRouter 任选，
在「添加新音乐节」页选厂商粘 key 即可）。Key 存在本地 `localStorage`，不会上传到任何地方。

## 📄 License

MIT
