---
target: 音乐节详情页
total_score: 28
p0_count: 1
p1_count: 2
timestamp: 2026-07-07T02-36-35Z
slug: src-screens-festivalscreen-jsx
---
# 音乐节详情页 · 设计评审快照

Method: dual-agent (A: design review · B: detector scan)
Score: 28/40

## 十大启发式
1 系统状态可见性 2 —— 「更多」舞台选中后收起，筛选生效但 chip 不可见；搜索时日期胶囊高亮但失效
2 贴近真实世界 3 —— FREQ/RUN-OF-SHOW/SET CT 圈内暗语无解释
3 用户控制与自由 3 —— 无 undo，误清标记不可恢复
4 一致性与标准 3 —— 空态说「演出列表」但 tab 叫 LINEUP
5 错误预防 2 —— 标记产生冲突瞬间无即时反馈
6 识别而非回忆 3 —— ⚠ 冲突不说和谁冲突
7 灵活性与效率 3 —— 无 NOW 锚点、无批量操作
8 美学与极简 4 —— 层级公式执行严格
9 错误恢复 3 —— 分享失败处理典范；冲突解决是死胡同
10 帮助与文档 2 —— 品牌梗无台阶

## 反模式判定
LLM：非 slop，个性资产扎实（票根卡/小时轴/条码脚注）。残留：🔍 彩色 emoji 破坏单色符号系统、seg 前缀符号装饰堆砌、空态文案 AI 句式。
检测器：5 hits 全部 side-tab（styles.css 611/694/946/950/953）；其中 4 条为死 CSS（.parse-error、.row-card.conf-* 无引用），1 条为上传流程 API 卡（有状态语义）。详情页文件零命中。浏览器 overlay 跳过（子代理无浏览器工具）。

## 优先问题
[P0] 触控目标全线不达标：act 钮 30×30、日期胶囊 ~25px、chip ~26px、清除钮 22px，违反 PRODUCT.md 的 ≥44px 承诺。改法：padding 扩热区，视觉不变。
[P1] 冲突是死胡同：⚠ badge 不可点、不具名、无解决动作。改法：badge 点开显示冲突方 + 跳转/降级快捷操作 + 标记瞬间 toast。
[P1] 筛选状态可隐身：收起「更多」不重置 stageFilter；搜索时日期胶囊假高亮；MY PLAN 静默继承 stage filter。
[P2] 对比度：dusty 蓝激活 chip 白字 ~3.0:1；--text-mute 用于 10px 计数；9px 字号出现三次。
[P2] 现场期没有「现在」：不自动选当天、无 NOW 锚点、无进行中高亮。
[P3] 「跨 3 天找到 N 条」硬编码（LineupList.jsx:75），两天音乐节说错话。

## 画像红旗
Alex（老手）：30 场单点无批量、误触无 undo、搜索后丢滚动位置、冲突人肉排查、MY PLAN 静默筛选像丢数据。
Jordan（新手）：首行 FREQ 暗语、搜索时图例消失、空 Top Pick 三槽是噪音、空态指路名称对不上、↗ 外链角标太弱。

## 次要
tablist 无键盘支持/aria-controls；chip.active 无 aria-pressed；enterkeyhint 缺失；跨午夜分组无 +1 标注；4 天以上 date-pills 撑爆 header；back-btn 游离设计系统（8px 圆角无硬阴影）；MY PLAN 计数总数与 per-day 并排歧义；死 CSS 四段可删。

## 挑衅问题
1 MY PLAN 是否本质是 chips 上的一个「MINE」筛选？纸张仪式感能否只属于分享流程？
2 标记为什么需要两个 30px 按钮而不是整卡热区循环？
3 产品知道现在几点，详情页为什么假装不知道（演出进行中模式）？
