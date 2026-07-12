# Brand — ENCORE.

产品名与 logo 资产。命名与图形均沿用 DESIGN.md 的视觉系统（复古音乐节海报 / 磁带语言），不引入新 hue、新字体。

- **Slogan（对外宣传）**：`LIVE BRINGS PEOPLE TOGETHER` —— live 泛指一切现场演出（音乐节 / 戏剧节等），mono 大写 + 正字距排版。2026-07-12 定稿 LIVE（此前短暂写作 LIFE，已废弃）。
- **App 内 tagline（首页抬头）**：沿用 i18n `home.tagline`（"不错过每一个想看的现场" / "Never miss a set you wanted"），不用 slogan。

## 名字：Encore（安可）

- 一个词，纯 live 语汇：只有现场才有安可——录音室里没有。
- 音乐节和戏剧节通吃：谢幕返场是两种演出共同的仪式。
- 它本身就是 "brings people together" 的具象时刻：全场所有人一起喊，把演出者叫回台上。一个人喊不出安可。
- 中文乐迷语境里"安可"已是通用词，无需教育；拼写简单，全球可读。
- 品牌写法：全大写 + 句点收尾 —— **ENCORE.**（句点用 `--bauhaus-red`，延续现有签名）。

备选（未采用）：Chorus（副歌/希腊戏剧歌队，双关好但英文里偏"合唱工具"联想）、Tutti（乐谱"全体奏"，含义最准但需要解释）。

## Logo 图形："安可时刻"

从人群这一侧看向舞台：

- **深红半圆** `#8b1d1d` —— 舞台亮起的光
- **三道墨色弧线** `#1e1506` —— 扩散的声浪 / 全场的安可呼喊
- **一排圆点** —— 聚在光前的人群；其中一颗 dusty 蓝 `#7e97a8` 是"你和你的同伴"
- 徽章底 `#fbf9f8` + 12px 墨色描边 + 实色偏移硬阴影，对应全站 `3px 3px 0` 手感

图形不含字母，换名（Chorus/Tutti）也可复用。

## 文件

| 文件 | 用途 |
|---|---|
| `encore-mark.svg` | 主标（方形徽章）：App 图标、favicon、头像位 |
| `encore-lockup.svg` | 横排组合（徽章 + ENCORE.）：官网头部、分享图页脚、宣传物料 |
| `encore-mark-mono.svg` | 单色墨版（无徽章底）：水印、票根章、印刷单色场景 |

## 落地状态

- `src/components/BrandMark.jsx`：反白小徽组件（墨底纸线，颜色走 CSS token），已替换 `HomeScreen.jsx` 与 `ContactSheet.jsx` 里的 "FP"。
- `HomeScreen.jsx` 标题改 "ENCORE."（tagline 沿用 `home.tagline`）；`ContactSheet.jsx` 名称改 "Encore."。
- `index.html`：标题 "Encore — Festival Planner"（保留品类词），新增 `public/favicon.svg`。
- i18n 许愿邮件文案中的 "Festival Planner" 已改 "Encore"。
- 待办：分享画布角落用 `encore-mark-mono.svg` 作水印，强化"设计即传播"。
