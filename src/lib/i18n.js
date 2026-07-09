import { createContext, createElement, useContext, useMemo, useState } from "react";

// 中英双语。产品名、音乐节名、艺人名、mono 英文标签（FREQ/LINEUP/STAGE 等）不翻译。
// t("key") 取当前语言文案；t("key", {n: 3}) 插值 {n}。

const DICT = {
  // ---------- 通用 / 导航 ----------
  "nav.home": { zh: "首页", en: "Home" },
  "nav.mine": { zh: "我的", en: "Mine" },

  // ---------- Home ----------
  "home.tagline": { zh: "不错过每一个想看的现场", en: "Never miss a set you wanted" },
  "home.search": { zh: "搜演出", en: "Search shows" },
  "home.channels": { zh: "频道", en: "Channels" },
  "home.noMatch": { zh: "— 没找到匹配的音乐节 —", en: "— No matching festival —" },
  "home.addNew": { zh: "添加新演出", en: "Add a festival" },
  "home.want": { zh: "想看", en: "Want" },
  "home.wantOn": { zh: "★ 想看", en: "★ Want" },
  "home.been": { zh: "去过", en: "Been" },
  "home.beenOn": { zh: "✓ 去过", en: "✓ Been" },
  "home.marked": { zh: "已标记", en: "marked" },
  "home.login": { zh: "登录", en: "Sign in" },
  "home.synced": { zh: "已同步", en: "Synced" },

  // ---------- Festival ----------
  "fest.day": { zh: "DAY", en: "DAY" },
  "fest.lineup": { zh: "LINEUP", en: "LINEUP" },
  "fest.myplan": { zh: "MY PLAN", en: "MY PLAN" },
  "fest.stage": { zh: "STAGE", en: "STAGE" },
  "fest.all": { zh: "ALL", en: "ALL" },
  "fest.more": { zh: "更多 +{n}", en: "More +{n}" },
  "fest.collapse": { zh: "收起 −", en: "Less −" },

  // ---------- Lineup ----------
  "lineup.search": { zh: "搜艺人 / 演出", en: "Search artist / show" },
  "lineup.foundAcross": { zh: "跨 {n} 天找到 {c} 条", en: "{c} across {n} days" },
  "lineup.noResult": { zh: "没有结果", en: "No results" },
  "lineup.must": { zh: "必看", en: "Must" },
  "lineup.maybe": { zh: "待定", en: "Maybe" },
  "lineup.noSets": { zh: "— NO SETS · 该筛选下无演出 —", en: "— NO SETS in this filter —" },
  "lineup.clash": { zh: "⚠ 撞 {n} 场", en: "⚠ {n} clash" },
  "lineup.preview": { zh: "▶ 试听", en: "▶ Play" },
  "lineup.previewStop": { zh: "◼ 停止", en: "◼ Stop" },
  "lineup.previewNone": { zh: "无试听", en: "No preview" },
  "lineup.previewRetry": { zh: "稍后再试", en: "Try later" },
  "lineup.notePlaceholder": { zh: "加句备注…（如：东南亚风格）", en: "Add a note… (e.g. SE-Asian vibe)" },
  "lineup.noteEdit": { zh: "编辑备注", en: "Edit note" },
  "lineup.demote": { zh: "把本场改为 ? 待定", en: "Set this to ? Maybe" },
  "lineup.now": { zh: "● NOW", en: "● NOW" },
  "lineup.sets": { zh: "SETS", en: "SETS" },

  // ---------- My Plan ----------
  "plan.topPick": { zh: "My Top Pick", en: "My Top Pick" },
  "plan.slot": { zh: "SLOT", en: "SLOT" },
  "plan.runOfShow": { zh: "RUN-OF-SHOW", en: "RUN-OF-SHOW" },
  "plan.list": { zh: "列表", en: "List" },
  "plan.timetable": { zh: "时间表", en: "Timetable" },
  "plan.noQueued": { zh: "— NO SETS QUEUED FOR THIS DAY —", en: "— NO SETS QUEUED FOR THIS DAY —" },
  "plan.goMark": { zh: "到「LINEUP」点 ★ 或 ? 标记演出", en: "Mark ★ or ? in LINEUP" },
  "plan.setCt": { zh: "SET CT", en: "SET CT" },
  "plan.total": { zh: "TOTAL", en: "TOTAL" },
  "plan.share": { zh: "生成分享图", en: "Share image" },
  "plan.sharing": { zh: "生成中…", en: "Rendering…" },
  "plan.shareFail": { zh: "生成失败", en: "Render failed" },
  "plan.retry": { zh: "重试", en: "Retry" },
  "plan.pickAxis": { zh: "选这场当主轴", en: "Set as main" },
  "plan.shareBtn": { zh: "分享 Share", en: "Share" },
  "plan.saved": { zh: "已保存", en: "Saved" },
  "plan.shareRetry": { zh: "失败，重试", en: "Failed, retry" },
  "plan.rendering": { zh: "生成图片…", en: "Rendering…" },
  "plan.shareImg": { zh: "分享图", en: "Share image" },
  "plan.renderingShort": { zh: "生成中…", en: "Rendering…" },
  "plan.topPickTitle": { zh: "最想看的三组音乐人", en: "Your top 3 acts" },
  "plan.topPickHint": { zh: "还能挑 {n} 个 · 从必看里选", en: "Pick {n} more · from your must-sees" },
  "plan.topPickFull": { zh: "已满 3 个 · 点已选项可取消", en: "3 picked · tap to remove" },
  "plan.topPickEmpty": { zh: "先去 Lineup 标几个必看再来", en: "Mark some must-sees in Lineup first" },
  "plan.removeConfirm": { zh: "再点取消", en: "Tap again" },
  "plan.clashMustMust": { zh: "⚠ MUST × MUST 冲突", en: "⚠ MUST × MUST clash" },
  "plan.clashMust": { zh: "⚠ 撞 MUST", en: "⚠ clashes MUST" },
  "plan.goMarkFull": { zh: "到 LINEUP 点 ★ 或 ? 标记演出", en: "Mark ★ or ? in LINEUP" },
  "plan.close": { zh: "关闭", en: "Close" },
  "plan.unmark": { zh: "取消标记", en: "Unmark" },
  "plan.shareModeList": { zh: "行程式", en: "Itinerary" },
  "plan.shareModeTable": { zh: "时间表式", en: "Timetable" },
  "plan.shareIncludeNotes": { zh: "包含我的备注", en: "Include my notes" },
  "plan.cancel": { zh: "取消", en: "Cancel" },
  "plan.download": { zh: "↗ 下载 / 分享", en: "↗ Download / Share" },
  "plan.done": { zh: "完成", en: "Done" },

  // ---------- Profile ----------
  "profile.sub": { zh: "想看 · 待看 · 看过", en: "Want · Planned · Been" },
  "profile.statWant": { zh: "想看", en: "Want" },
  "profile.statPlan": { zh: "待看", en: "Planned" },
  "profile.statSeen": { zh: "看过", en: "Been" },
  "profile.want": { zh: "WANT / 想看", en: "WANT" },
  "profile.planned": { zh: "PLANNED / 待看计划", en: "PLANNED" },
  "profile.attended": { zh: "ATTENDED / 看过", en: "ATTENDED" },
  "profile.wantEmpty": { zh: "— 在首页卡片右上角点「想看」收藏 —", en: "— Tap “Want” on a festival card —" },
  "profile.plannedEmpty": { zh: "— 进音乐节标 ★ 必看 / ? 待定 · 计划会出现在这里 —", en: "— Mark ★ / ? in a festival to build a plan —" },
  "profile.attendedEmpty": { zh: "— 去过哪场就在首页点「去过」· 这里会长出你的现场履历 —", en: "— Tap “Been” on a festival you attended —" },
  "profile.setsMarked": { zh: "SETS MARKED", en: "SETS MARKED" },
  "profile.artistsSeen": { zh: "{n} 组艺人", en: "{n} artists" },
  "profile.noMustSeen": { zh: "没标过必看 · 去时间表里补标 ★ 就会出现在这里", en: "No must-sees marked yet" },
  "profile.notLoggedIn": { zh: "未登录", en: "Not signed in" },
  "profile.loginSynced": { zh: "● 已登录 · 标注自动同步", en: "● Signed in · auto-syncing" },
  "profile.localOnly": { zh: "数据仅存本机 · 登录后跨设备同步", en: "Local only · sign in to sync" },
  "profile.cloudOff": { zh: "云端未配置 · 数据仅存本机", en: "Cloud off · local only" },
  "profile.signOut": { zh: "退出", en: "Sign out" },
  "profile.totalMarks": { zh: "共标记 {n} 场演出", en: "{n} sets marked total" },
  "profile.signedOut": { zh: "已退出 · 本机数据保留", en: "Signed out · local data kept" },

  // ---------- Login ----------
  "login.title": { zh: "登录 / 同步", en: "Sign in / Sync" },
  "login.email": { zh: "邮箱", en: "Email" },
  "login.sendCode": { zh: "发验证码", en: "Send code" },
  "login.resend": { zh: "重发", en: "Resend" },
  "login.sending": { zh: "发送中…", en: "Sending…" },
  "login.code": { zh: "验证码", en: "Code" },
  "login.submit": { zh: "登录", en: "Sign in" },
  "login.close": { zh: "关闭", en: "Close" },

  // ---------- 联系 / 关于作者 ----------
  "contact.entry": { zh: "联系作者", en: "Contact" },
  "contact.title": { zh: "联系 / 关于", en: "Contact" },
  "contact.intro": { zh: "欢迎 reach out 🌹", en: "欢迎 reach out 🌹" },
  "contact.email": { zh: "邮箱", en: "Email" },
  "contact.xhs": { zh: "小红书", en: "RED · 小红书" },

  // ---------- Toast ----------
  "toast.mustAdded": { zh: "★ 必看 +1", en: "★ Must +1" },
  "toast.maybeAdded": { zh: "? 待定 +1", en: "? Maybe +1" },
  "toast.unmarked": { zh: "已取消标记", en: "Unmarked" },
  "toast.clash": { zh: "⚠ 和 {name} 撞档了", en: "⚠ Clashes with {name}" },
  "toast.beenOn": { zh: "✓ 已标去过", en: "✓ Marked as been" },
  "toast.beenOff": { zh: "已取消去过", en: "Removed from been" },
  "toast.wantOn": { zh: "★ 已加想看", en: "★ Added to want" },
  "toast.wantOff": { zh: "已取消想看", en: "Removed from want" },

  // ---------- Upload ----------
  "upload.title1": { zh: "UPLOAD", en: "UPLOAD" },
  "upload.title2": { zh: "POSTER", en: "POSTER" },
  "upload.channel": { zh: "FESTIVAL · NEW", en: "FESTIVAL · NEW" },
  "upload.publish": { zh: "发布", en: "Publish" },
  "upload.step0": { zh: "STEP 0 · 先搜一下 — 已经有人传过就不用重复上传了", en: "STEP 0 · Search first — someone may have added it" },
  "upload.dupNone": { zh: "— 还没人传过 · 往下走上传或许愿 —", en: "— Not added yet · upload or request below —" },
  "upload.added": { zh: "已收录 ↗", en: "Added ↗" },
  "upload.orUpload": { zh: "没有？上传海报识别", en: "No? Upload a poster" },
  "upload.lockedTitle": { zh: "配好 API 后，AI 自动解析演出信息", en: "Set up API, AI parses the poster" },
  "upload.lockedSub": { zh: "在下方配置你的 API Key，快速生成演出 Lineup", en: "Add your API key below to generate the lineup" },
  "upload.pickPoster": { zh: "点这里选海报", en: "Pick a poster" },
  "upload.posterHint": { zh: "JPG / PNG / WEBP · 一张就够", en: "JPG / PNG / WEBP · one is enough" },
  "upload.apiConfig": { zh: "配置 API Key", en: "Configure API Key" },
  "upload.notConfigured": { zh: "未配置", en: "Not set" },
  "upload.configured": { zh: "已配置 {name}", en: "{name} set" },
  "upload.set": { zh: "设置 +", en: "Set +" },
  "upload.collapse2": { zh: "收起 −", en: "Hide −" },
  "upload.apiIntro": { zh: "选好用哪家 · 粘上 key 就行 · key 只存本机 localStorage · 不上传", en: "Pick a provider · paste your key · stored locally only" },
  "upload.whichAi": { zh: "用哪家的 AI", en: "Which AI" },
  "upload.readImgWith": { zh: "↳ 用 {model} 读图 · key 在 {where} 申请", en: "↳ Reads images via {model} · get key at {where}" },
  "upload.baseUrl": { zh: "API 地址（Base URL）", en: "API Base URL" },
  "upload.baseUrlHint": { zh: "任何 OpenAI 兼容接口（中转站 / OpenRouter / 自建）· 填到 /v1 即可，会自动补全 /chat/completions", en: "Any OpenAI-compatible endpoint · up to /v1, /chat/completions auto-appended" },
  "upload.modelName": { zh: "模型名", en: "Model name" },
  "upload.modelHint": { zh: "必须是能看图的视觉模型 · 名字以服务商的模型列表为准", en: "Must be a vision model · see the provider’s model list" },
  "upload.test": { zh: "测试", en: "Test" },
  "upload.testing": { zh: "测…", en: "Testing…" },
  "upload.save": { zh: "保存", en: "Save" },
  "upload.saved": { zh: "已保存 · {msg}", en: "Saved · {msg}" },
  "upload.savedOn": { zh: "现在上传的海报会走真实识别", en: "uploads now use real recognition" },
  "upload.savedOff": { zh: "已清空 key", en: "key cleared" },
  "upload.cantConfig": { zh: "不会配 API？", en: "Can’t set up an API?" },
  "upload.wishHint": { zh: "可以联系我们代为解析（但可能会比较慢，请耐心等候）🌹", en: "We can add it for you (may take a while, thanks for your patience) 🌹" },
  "upload.wishName": { zh: "音乐节名称 *", en: "Festival name *" },
  "upload.wishYear": { zh: "年份", en: "Year" },
  "upload.wishLink": { zh: "官方链接 / 购票页（选填）", en: "Official / ticket link (optional)" },
  "upload.wishSubmit": { zh: "提交", en: "Submit" },
  "upload.wishSubmitting": { zh: "提交中…", en: "Submitting…" },
  "upload.wishMail": { zh: "✉ 发送许愿邮件", en: "✉ Send by email" },
  "upload.wishDone": { zh: "✓ 已收到「{name}」！", en: "✓ Got “{name}”!" },
  "upload.wishDoneSub": { zh: "我们会尽快解析录入 · 完成后刷新首页就能看到", en: "We’ll add it soon · refresh Home when it’s in" },
  "upload.wishAgain": { zh: "＋ 再提交一个", en: "＋ Submit another" },
  "upload.wishTooSoon": { zh: "收到过啦 · 一分钟后可以再许下一个", en: "Got it · try again in a minute" },

  // Review（校对页）
  "review.compare": { zh: "原图对照", en: "Original" },
  "review.viewOriginal": { zh: "原图 ↗", en: "Full ↗" },
  "review.expand": { zh: "展开 +", en: "Expand +" },
  "review.collapse": { zh: "收起 −", en: "Collapse −" },
  "review.name": { zh: "名称", en: "Name" },
  "review.year": { zh: "年份", en: "Year" },
  "review.location": { zh: "地点", en: "Location" },
  "review.dates": { zh: "日期 ({n} 天)", en: "Dates ({n} days)" },
  "review.stages": { zh: "舞台 ({n} 个)", en: "Stages ({n})" },
  "review.perfs": { zh: "演出列表 · {n} 条", en: "Sets · {n}" },
  "review.addRow": { zh: "＋ 加一条", en: "＋ Add row" },
  "review.emptyPerfs": { zh: "— 一条都没识别出来 · 点 ＋ 加一条 或重新上传 —", en: "— Nothing recognized · add a row or re-upload —" },
  "review.artist": { zh: "艺人", en: "Artist" },
  "review.stagePh": { zh: "舞台", en: "Stage" },
  "review.datePh": { zh: "日期", en: "Date" },
  "review.confirmDel": { zh: "确认?", en: "Sure?" },
  "review.restart": { zh: "← 重新选图", en: "← Pick another" },

  // Parsing
  "parse.ready": { zh: "准备图片…", en: "Preparing image…" },
  "parse.parsing": { zh: "处理中…", en: "Processing…" },
  "parse.parseFail": { zh: "识别失败", en: "Recognition failed" },
  "parse.parsingHint": { zh: "VISION 直读约 5-15 秒 · OCR 兜底可能要 30 秒+", en: "Vision ~5-15s · OCR fallback may take 30s+" },
  "review.compareShrink": { zh: "缩小", en: "Zoom out" },
  "review.compareZoom": { zh: "放大", en: "Zoom in" },
  "review.namePh": { zh: "音乐节名称", en: "Festival name" },
  "review.chipsHint": { zh: "用逗号分隔多项 · 失焦自动保存", en: "Comma-separated · saves on blur" },
  "review.posterAlt": { zh: "上传的海报", en: "Uploaded poster" },

  // ---------- 分享图 / 时间表 ----------
  "share.slogan": { zh: "保存你的观演计划，呼朋唤友一起去看演出吧！", en: "Save your lineup — round up your crew and go!" },
  "share.main": { zh: "主看", en: "Main" },
  "share.legendTop": { zh: "最想看", en: "Top pick" },


  "tt.emptyTitle": { zh: "— EMPTY · 还没有标记任何演出 —", en: "— EMPTY · nothing marked yet —" },
  "tt.emptyHint": { zh: "先去 Lineup 标几个必看 / 待定，再来这里看时间表", en: "Mark some ★ / ? in Lineup, then check the timetable" },
  "tt.promote": { zh: "点击 → 提到主轴", en: "Tap → make it main" },

  // ---------- 上传错误页 ----------
  "upload.errTag": { zh: "识别失败", en: "Recognition failed" },
  "upload.errShowRaw": { zh: "展开 原始 API 返回", en: "Show raw API response" },
  "upload.errHideRaw": { zh: "收起 原始 API 返回", en: "Hide raw API response" },
  "upload.errVisionPath": { zh: "Vision 路径", en: "Vision path" },
  "upload.errOcrPath": { zh: "OCR + Chat 路径", en: "OCR + Chat path" },
  "upload.errNoBody": { zh: "(无 body)", en: "(no body)" },
  "upload.errDeepseek": { zh: "💡 DeepSeek 的 deepseek-chat 是纯文本模型，不接收图片 · 视觉模型走 SiliconFlow 等第三方", en: "💡 DeepSeek’s deepseek-chat is text-only and can’t read images · use a vision model (SiliconFlow etc.)" },
  "upload.errRetry": { zh: "重试", en: "Retry" },
  "upload.sourceParsed": { zh: "AI 解析 + 人工校对", en: "AI parsed + human reviewed" },

  // ---------- 许愿邮件正文（本地兜底 mailto） ----------
  "upload.wishBodyIntro": { zh: "想在 Encore 里看到这个音乐节：", en: "I’d love to see this festival in Encore:" },
  "upload.wishBodyName": { zh: "音乐节", en: "Festival" },
  "upload.wishBodyYear": { zh: "年份", en: "Year" },
  "upload.wishBodyLink": { zh: "官方链接/购票页", en: "Official / ticket link" },
  "upload.wishBodyNone": { zh: "（没有）", en: "(none)" },
  "upload.wishBodyFrom": { zh: "—— 来自 Encore 许愿表单", en: "—— via the Encore request form" },

  // ---------- 无障碍标签 ----------
  "aria.back": { zh: "返回", en: "Back" },
  "aria.clearSearch": { zh: "清空搜索", en: "Clear search" },
  "aria.markMust": { zh: "标为必看", en: "Mark as must-see" },
  "aria.unmarkMust": { zh: "取消必看", en: "Remove must-see" },
  "aria.markMaybe": { zh: "标为待定", en: "Mark as maybe" },
  "aria.unmarkMaybe": { zh: "取消待定", en: "Remove maybe" },
  "aria.previewPlay": { zh: "试听 30 秒", en: "Play 30s preview" },
  "aria.previewStop": { zh: "停止试听", en: "Stop preview" },
  "aria.delRow": { zh: "删除该条", en: "Delete row" },
  "aria.delConfirm": { zh: "再点一次确认删除", en: "Tap again to confirm" },
  "aria.addFestival": { zh: "添加新演出", en: "Add a festival" },
};

function interpolate(str, vars) {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
}

const LANG_KEY = "me:lang";
export function loadLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "zh" || saved === "en") return saved;
    // 首次：跟随浏览器语言
    return (navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en";
  } catch {
    return "zh";
  }
}
export function saveLang(lang) {
  try { localStorage.setItem(LANG_KEY, lang); } catch {}
}

const I18nContext = createContext({ lang: "zh", t: (k) => k, setLang: () => {} });

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(loadLang);
  const value = useMemo(() => {
    const t = (key, vars) => {
      const entry = DICT[key];
      if (!entry) return key;
      return interpolate(entry[lang] ?? entry.zh ?? key, vars);
    };
    const setLang = (l) => { saveLang(l); setLangState(l); };
    return { lang, t, setLang };
  }, [lang]);
  return createElement(I18nContext.Provider, { value }, children);
}

export function useI18n() {
  return useContext(I18nContext);
}
