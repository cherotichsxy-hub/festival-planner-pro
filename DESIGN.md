# Design

从现有代码（src/styles.css）提取的视觉系统。identity 已定型：**复古音乐节海报 / 磁带牌面**语言，新工作沿用此系统，不另起炉灶。

## Theme

暖纸底浅色主题（无深色模式）。物理场景：乐迷在户外强光下单手看手机——浅底深字、高对比、硬边框。

## Colors

主视觉四色 + 舞台色板，全部低饱和"dusty"复古调。定义在 `src/styles.css` 的 `:root`。

| Token | 值 | 用途 |
|---|---|---|
| `--bg-page` | `#f7f5f3` | 页面底（中性灰白，非奶油色调） |
| `--bg-phone` | `#fbf9f8` | 卡片/手机壳底 |
| `--bg-soft` | `#f3f1ee` | 内容区底 |
| `--text` | `#1e1506` | 墨色（暖黑），也用作边框与硬阴影 |
| `--text-mute` | `#847362` | 次要文字（勿用于正文——对比度不足） |
| `--bauhaus-red` | `#8b1d1d` | 品牌深红（crimson），强调/警示/badge |
| `--bauhaus-blue` | `#7e97a8` | dusty 蓝 |
| `--bauhaus-yellow` | `#b76060` | 红色族变体（hover/active 面） |
| `--line` / `--line-strong` | `#d8d4cf` / `#b0a89e` | 分隔线 |

**舞台色板**（`src/lib/stages.js` PALETTE）：crimson/blue/sage/mustard/rust/slate/wine/olive 八色按舞台位置循环分配，各带 solid/soft/text 三档。**磁带条色板**（HomeScreen CASSETTE_COLORS）：同族八色循环。

规则：颜色永远从这两个色板取，不引入新 hue；黄色磁带条（#ecc12a）上必须用深字 `--paper-ink`。

## Typography

系统字优先，零网络字体（现场网络差是产品约束）：

- `--font-display`：-apple-system / Helvetica Neue / PingFang SC —— 大标题，900 重量 + 负字距，全大写英文（"FESTIVAL PLANNER."、"UPLOAD POSTER."，句点收尾是品牌签名）
- `--font-mono`：SF Mono / Menlo —— 标签、元数据、计数（`u-mono` 类），常配 0.06-0.16em 正字距 + 全大写
- 正文：系统 sans，14-15px

层级公式：**超大 display 标题 + 小号 mono 标签**的极端对比是本产品的排版声音；中间档尽量少。

## Components

- **磁带卡片**（cassette-card）：顶部彩色色条（横纹反光线 + 两个穿孔点）+ 纸底信息区；首页音乐节列表专用
- **硬阴影卡**：`box-shadow: 3px 3px 0 var(--text)` 实色偏移阴影 + 1.5px 实线边框；:active 时位移 1px 模拟按压。全站按钮/卡片的标准手感
- **虚线卡**（wish-card）：1.5px dashed 边框 = "非正式/求助"语义
- **chip**：小型方角标签按钮（舞台筛选、想看/去过），active 态填充舞台色
- **分段控件**（seg-bar）：等分胶囊，active 格反白填充
- **底部 Tab**（root-nav）：常驻三格（首页/＋/我的），active 格 `--bauhaus-yellow` 填充；中间＋为墨色方块
- **分隔条**（upload-divider）：居中文字 + 两侧细线，mono 小字
- **rack-title**：mono 标题 + 右侧两位数计数（"WANT / 想看 …… 01"），列表区头部标准件

## Layout

- 手机壳容器：max-width 440px 居中，`100dvh`，桌面端圆角 + 投影悬浮于灰底
- 内容区左右 padding 16px；区块间距 20px 上下
- 全屏结构：header（品牌区，`--bg-phone`）→ 滚动内容区（`--bg-soft`）→ 常驻底部 Tab
- 分享画布：离屏渲染（left: -30000px），720-1760px 宽按列数

## Motion

现状几乎无动效（仅 :active 按压位移）。补动效时：ease-out 曲线、只动 transform/opacity、必须带 prefers-reduced-motion 降级；风格参考"实体物件"——干脆、无弹跳。

## Voice（UX 文案）

- 中文为主，动词开头，短句，中点 `·` 分隔并列信息
- mono 标签用英文大写（LINEUP / MY PLAN / FIND / FREQ）
- 状态符号系统：★ 必看 / ? 待定 / ● 计数 / ✓ 完成 / ⚠ 冲突
