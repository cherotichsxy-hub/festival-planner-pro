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

## 🧠 关于 AI 解析

需要你提供一个 DeepSeek API key（首次上传海报时会引导你填）。Key 存在本地 `localStorage`，不会上传到任何地方。

## 📄 License

MIT
