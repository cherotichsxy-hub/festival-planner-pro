// 时间表解析：优先 DeepSeek vision，回退 Tesseract OCR + DeepSeek chat。
// 没有 API key 时给一份 mock 数据，让用户能跑通完整流程。
//
// 注意：DeepSeek 官方的 deepseek-chat / deepseek-reasoner 都是纯文本模型，
// 直接吃 image_url content block 会返回 400 之类。真正的视觉模型走 SiliconFlow
// 等第三方 endpoint。这里默认就请求 deepseek-chat，失败时 raw 显示出来让用户排查。

const DEFAULT_URL = "https://api.deepseek.com/v1/chat/completions";
const DEFAULT_MODEL = "deepseek-chat";

// 厂商预设：用户只选厂商 + 粘 key，地址和模型都内置。
// 只收录有视觉（看图）模型的厂商——DeepSeek 等纯文本模型识别不了海报，不放进来。
// maxTokens = 请求里显式给的输出上限（有些家默认值很小，不给会截断 JSON）。
// keyHint = key 去哪申请；note = 选中时展示的特别提醒。
export const PROVIDERS = [
  { id: "kimi",      label: "Kimi (CN)",   url: "https://api.moonshot.cn/v1/chat/completions",  model: "moonshot-v1-32k-vision-preview", vision: true, maxTokens: 8192, keyHint: "platform.moonshot.cn" },
  { id: "kimi-intl", label: "Kimi (Intl)", url: "https://api.moonshot.ai/v1/chat/completions",  model: "moonshot-v1-32k-vision-preview", vision: true, maxTokens: 8192, keyHint: "platform.moonshot.ai" },
  { id: "claude",    label: "Anthropic",   url: "https://api.anthropic.com/v1/chat/completions", model: "claude-sonnet-5",               vision: true, maxTokens: 8192, keyHint: "console.anthropic.com" },
  { id: "openai",    label: "OpenAI",      url: "https://api.openai.com/v1/chat/completions",   model: "gpt-4o-mini",                    vision: true, maxTokens: 8192, keyHint: "platform.openai.com",
    note: "⚠ OpenAI 官方接口不允许浏览器直连，直填大概率连不通；有中转地址的话请选「自定义」" },
  { id: "glm",       label: "GLM",         url: "https://open.bigmodel.cn/api/paas/v4/chat/completions",              model: "glm-4v-plus",  vision: true, maxTokens: 1024, keyHint: "open.bigmodel.cn" },
  { id: "qwen",      label: "QWEN",        url: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", model: "qwen-vl-plus", vision: true, maxTokens: 1500, keyHint: "阿里云百炼控制台" },
  { id: "custom",    label: "Custom",      url: "", model: "", vision: true, maxTokens: 4096 },
];

// 自定义地址容错：填到域名或 /v1 都行，自动补全成完整的 chat/completions 端点
export function normalizeApiUrl(input) {
  let url = (input || "").trim().replace(/\/+$/, "");
  if (!url) return "";
  if (!/^https?:\/\//.test(url)) url = `https://${url}`;
  if (!/\/chat\/completions$/.test(url)) {
    if (!/\/v\d+[a-z]*$/i.test(url)) url += "/v1";
    url += "/chat/completions";
  }
  return url;
}

// 存 localStorage "me:vision_api" = { provider, key, url?, model? }（url/model 仅自定义时用）
// 兼容两代旧格式：{url,model,key}（无 provider → 视为自定义）、"me:deepseek_api_key"（纯 key）。
export function getVisionConfig() {
  try {
    const raw = localStorage.getItem("me:vision_api");
    if (raw) {
      const cfg = JSON.parse(raw);
      const key = (cfg.key || "").trim();
      if (cfg.provider && cfg.provider !== "custom") {
        const preset = PROVIDERS.find((p) => p.id === cfg.provider);
        if (preset) {
          return { provider: preset.id, url: preset.url, model: preset.model, key, vision: preset.vision, maxTokens: preset.maxTokens };
        }
      }
      // custom 或旧格式 {url,model,key}（含已下架厂商的旧配置，按自定义处理）
      return {
        provider: "custom",
        url: normalizeApiUrl(cfg.url) || DEFAULT_URL,
        model: (cfg.model || "").trim() || DEFAULT_MODEL,
        key,
        vision: true,
        maxTokens: 4096,
      };
    }
    return { provider: "kimi", url: PROVIDERS[0].url, model: PROVIDERS[0].model, key: "", vision: true, maxTokens: 8192 };
  } catch {
    return { provider: "kimi", url: PROVIDERS[0].url, model: PROVIDERS[0].model, key: "", vision: true, maxTokens: 8192 };
  }
}

export function saveVisionConfig({ provider, url, model, key }) {
  try {
    localStorage.setItem(
      "me:vision_api",
      JSON.stringify({
        provider: provider || "custom",
        url: (url || "").trim(),
        model: (model || "").trim(),
        key: (key || "").trim(),
      }),
    );
  } catch {}
}

const SCHEMA_PROMPT = `你是音乐节时间表识别助手。我会给你一张音乐节海报或官方时间表截图。
请把图里能识别到的信息整理成下列 JSON 结构：

{
  "festival": {
    "name": "音乐节中文/英文名（例：春游音乐节 或 FUJI ROCK FESTIVAL）",
    "year": 2026,
    "location": "举办城市 · 场地",
    "dates": ["YYYY-MM-DD", ...],
    "stages": ["大舞台名", "二号舞台名", ...]
  },
  "performances": [
    {
      "artistName": "艺人名（保留原文，中/英/日均可）",
      "stageName": "属于哪个 stage（必须出现在上面的 stages 列表里）",
      "displayDate": "YYYY-MM-DD（按 festival 日历计算，跨午夜场仍归属起始那天）",
      "startAt": "YYYY-MM-DDTHH:mm:00（真实日历时间，凌晨场用次日 ISO）",
      "endAt":   "YYYY-MM-DDTHH:mm:00"
    }
  ]
}

约束：
- 不要捏造图里看不到的信息。识别不到的字段写 null。
- 【最重要】看不清的条目直接跳过，宁缺毋假。如果整张图都无法辨认，输出 "performances": []。禁止凭常识猜测或编造艺人名、时间。
- festival.name 通常是海报上最醒目的大标题文字，认得出就填。
- 海报可能是表格版式（行=剧目/艺人，列=日期，格子=场次时间）。同一剧目演多天时，只为图里明确标出场次的那些天各输出一条，不要自行把日期范围展开成每一天。
- 表格行首若是「场地名《剧目名》」的组合，书名号里的剧目名就是 artistName，场地名是 stageName。戏剧节的剧目名、音乐节的艺人名都填在 artistName。
- 跨午夜场：例如 7/24 23:30 ~ 25:00 → displayDate "2026-07-24"，startAt "2026-07-24T23:30:00"，endAt "2026-07-25T01:00:00"。
- 时间一律 24 小时制，且补到分钟。
- 只输出 JSON 本体，不要 markdown 代码块，不要任何解释文字。`;

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 海报处理策略（二维切片）：
//  - 原图按 ~1400×1800 的源区域切成 cols×rows 的网格（1:1 裁切保清晰度），块间重叠防切断行/列
//  - 竖长图（11 天排期长图）→ 多行；横向网格海报（列=日期）→ 多列；都能拆
//  - 切片时额外生成一张全图缩略图随每个请求发出，帮模型理解整体版式（行列各代表什么）
//  - 教训：曾用"最长边压 2000px"，会把 1080×15000 长图压成 144×2000，字全糊 → 模型幻觉
const TILE_SRC_W = 1400;
const TILE_SRC_H = 1800;
const TILE_OVERLAP = 150;
const TILE_OUT_W = 1280;
const TILE_OUT_H = 1600;
const MAX_TILES = 12;
const OVERVIEW_DIM = 900;

async function prepareImageTiles(file) {
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch (e) {
    console.warn("[parse] 图片解码失败，直接发原文件:", e);
    return { tiles: [{ dataUrl: await fileToDataUrl(file), label: "" }], overview: null };
  }
  const W = bitmap.width;
  const H = bitmap.height;

  function drawRegion(sx, sy, sw, sh, outW, outH) {
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    canvas.getContext("2d").drawImage(bitmap, sx, sy, sw, sh, 0, 0, outW, outH);
    return canvas.toDataURL("image/jpeg", 0.88);
  }

  let cols = Math.max(1, Math.round(W / TILE_SRC_W));
  let rows = Math.max(1, Math.round(H / TILE_SRC_H));
  while (cols * rows > MAX_TILES) {
    if (rows >= cols && rows > 1) rows--;
    else if (cols > 1) cols--;
    else break;
  }

  // 单块：整图直接缩到输出上限内
  if (cols === 1 && rows === 1) {
    const scale = Math.min(1, TILE_OUT_W / W, TILE_OUT_H / H);
    const single = drawRegion(0, 0, W, H, Math.round(W * scale), Math.round(H * scale));
    bitmap.close?.();
    return { tiles: [{ dataUrl: single, label: "" }], overview: null };
  }

  const tileW = Math.ceil(W / cols);
  const tileH = Math.ceil(H / rows);
  const tiles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const sx = Math.max(0, c * tileW - (c > 0 ? TILE_OVERLAP : 0));
      const sy = Math.max(0, r * tileH - (r > 0 ? TILE_OVERLAP : 0));
      const sw = Math.min(W - sx, tileW + (c > 0 ? TILE_OVERLAP : 0) + (c < cols - 1 ? TILE_OVERLAP : 0));
      const sh = Math.min(H - sy, tileH + (r > 0 ? TILE_OVERLAP : 0) + (r < rows - 1 ? TILE_OVERLAP : 0));
      const outScale = Math.min(1, TILE_OUT_W / sw, TILE_OUT_H / sh);
      tiles.push({
        dataUrl: drawRegion(sx, sy, sw, sh, Math.round(sw * outScale), Math.round(sh * outScale)),
        label: `第 ${r + 1}/${rows} 行、第 ${c + 1}/${cols} 列`,
      });
    }
  }
  const ovScale = Math.min(1, OVERVIEW_DIM / Math.max(W, H));
  const overview = drawRegion(0, 0, W, H, Math.round(W * ovScale), Math.round(H * ovScale));
  bitmap.close?.();
  return { tiles, overview };
}

function safeParse(jsonStr) {
  const cleaned = String(jsonStr || "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

// 自定义错误：携带原始 response，方便 UI 拿出来给用户看
class ParseError extends Error {
  constructor(message, { stage, status, raw } = {}) {
    super(message);
    this.name = "ParseError";
    this.stage = stage; // "vision" | "ocr" | "chat"
    this.status = status;
    this.raw = raw;
  }
}

// Anthropic 从浏览器直连需要这个 opt-in header，其他家忽略它也无害
function buildHeaders(cfg) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${cfg.key}`,
  };
  if (cfg.url.includes("api.anthropic.com")) {
    headers["anthropic-dangerous-direct-browser-access"] = "true";
  }
  return headers;
}

async function callVisionOnce(imageUrls, cfg, extraPrompt = "") {
  const imageBlocks = (Array.isArray(imageUrls) ? imageUrls : [imageUrls]).map(
    (url) => ({ type: "image_url", image_url: { url } }),
  );
  let res;
  try {
    res = await fetch(cfg.url, {
      method: "POST",
      headers: buildHeaders(cfg),
      body: JSON.stringify({
        model: cfg.model,
        messages: [
          {
            role: "user",
            content: [
              ...imageBlocks,
              { type: "text", text: SCHEMA_PROMPT + extraPrompt },
            ],
          },
        ],
        temperature: 0,
        ...(cfg.maxTokens ? { max_tokens: cfg.maxTokens } : {}),
      }),
    });
  } catch (netErr) {
    throw new ParseError(`网络错误: ${netErr.message}`, { stage: "vision" });
  }
  const bodyText = await res.text().catch(() => "");
  if (!res.ok) {
    throw new ParseError(
      `HTTP ${res.status}`,
      { stage: "vision", status: res.status, raw: bodyText.slice(0, 2000) },
    );
  }
  let json;
  try {
    json = JSON.parse(bodyText);
  } catch {
    throw new ParseError("Response 不是 JSON", {
      stage: "vision",
      raw: bodyText.slice(0, 2000),
    });
  }
  if (json.choices?.[0]?.finish_reason === "length") {
    // 输出被截断 → JSON 八成是坏的，明确报出来而不是静默丢数据
    console.warn("[parse] 输出被 max_tokens 截断");
  }
  const content = json.choices?.[0]?.message?.content || "";
  try {
    return safeParse(content);
  } catch (parseErr) {
    throw new ParseError(`返回内容不是 JSON: ${parseErr.message}`, {
      stage: "vision",
      raw: content.slice(0, 2000),
    });
  }
}

// 多段识别结果合并：festival 元数据取第一个非空，dates/stages 取并集，performances 去重
function mergeParsed(results) {
  const festival = { name: null, year: null, location: null, dates: [], stages: [] };
  const dates = new Set();
  const stages = new Set();
  for (const r of results) {
    const f = r.festival || {};
    if (!festival.name && f.name) festival.name = f.name;
    if (!festival.year && f.year) festival.year = f.year;
    if (!festival.location && f.location) festival.location = f.location;
    for (const d of f.dates || []) if (d) dates.add(d);
    for (const s of f.stages || []) if (s) stages.add(s);
  }
  // 年份矫正：分段识别时后面的段看不到海报头部年份，模型可能猜错。
  // 已知年份时，把偏差的年份统一改回来（跨年场次的 year+1 除外）。
  function fixYear(iso) {
    if (!iso || !festival.year) return iso;
    const y = Number(String(iso).slice(0, 4));
    if (!Number.isFinite(y) || y === festival.year || y === festival.year + 1) return iso;
    return `${festival.year}${String(iso).slice(4)}`;
  }

  festival.dates = Array.from(dates, fixYear).sort();
  festival.dates = Array.from(new Set(festival.dates));
  festival.stages = Array.from(stages);

  const seen = new Set();
  const performances = [];
  for (const r of results) {
    for (const p of r.performances || []) {
      // 完全空的条目才丢；只缺名字的保留（校对页就是让人补漏的）
      if (!p || (!p.artistName && !p.startAt && !p.stageName)) continue;
      const fixed = {
        ...p,
        artistName: p.artistName || "",
        displayDate: fixYear(p.displayDate),
        startAt: fixYear(p.startAt),
        endAt: fixYear(p.endAt),
      };
      const key = `${fixed.artistName}|${fixed.displayDate}|${fixed.startAt}|${fixed.stageName}`;
      if (seen.has(key)) continue;
      seen.add(key);
      performances.push(fixed);
    }
  }
  return { festival, performances };
}

async function callVision(file, cfg, onProgress) {
  const { tiles, overview } = await prepareImageTiles(file);
  if (tiles.length === 1) {
    // 单块也走 mergeParsed：去重 + 年份矫正对所有路径生效
    const r = await callVisionOnce(tiles[0].dataUrl, cfg);
    return mergeParsed([r]);
  }
  onProgress?.(`海报切成 ${tiles.length} 块分别识别…`);
  const results = [];
  let lastErr = null;
  // 头部信息（名称/年份/日期）通常只在某一块出现；识别到后传给后续块，防止模型自己瞎猜年份
  let known = null;
  for (let i = 0; i < tiles.length; i++) {
    onProgress?.(`识别第 ${i + 1}/${tiles.length} 块…`);
    const sliceNote =
      `\n\n补充说明：给你两张图。第一张是完整海报的缩略图，仅用于理解整体版式` +
      `（比如行/列各代表什么），不要从里面抠具体文字。第二张是海报的高清局部` +
      `（${tiles[i].label}），边缘可能有被切断的内容、与相邻块有少量重叠。` +
      `只提取第二张图里能完整看清的条目；名称/年份/地点看不到就写 null。`;
    const contextNote = known
      ? `\n已知信息（来自其他分块，直接沿用，不要另猜）：名称「${known.name || "未知"}」` +
        `，年份 ${known.year || "未知"}，已见日期 ${JSON.stringify(known.dates || [])}。` +
        `本块所有日期的年份必须与已知年份一致。`
      : "";
    try {
      const r = await callVisionOnce(
        overview ? [overview, tiles[i].dataUrl] : tiles[i].dataUrl,
        cfg,
        sliceNote + contextNote,
      );
      results.push(r);
      if (!known && (r.festival?.name || r.festival?.year)) known = r.festival;
    } catch (err) {
      lastErr = err;
      console.warn(`[parse] 第 ${i + 1}/${tiles.length} 块识别失败:`, err);
    }
  }
  if (results.length === 0) {
    throw lastErr || new ParseError("所有分块都识别失败", { stage: "vision" });
  }
  const merged = mergeParsed(results);
  merged._debug = { tiles: tiles.length, tilesOk: results.length };
  return merged;
}

async function callChat(ocrText, cfg) {
  let res;
  try {
    res = await fetch(cfg.url, {
      method: "POST",
      headers: buildHeaders(cfg),
      body: JSON.stringify({
        model: cfg.model,
        messages: [
          {
            role: "user",
            content: `${SCHEMA_PROMPT}\n\n以下是 OCR 抓到的文字，请尽你所能还原结构：\n\n${ocrText}`,
          },
        ],
        temperature: 0,
        ...(cfg.maxTokens ? { max_tokens: cfg.maxTokens } : {}),
      }),
    });
  } catch (netErr) {
    throw new ParseError(`网络错误: ${netErr.message}`, { stage: "chat" });
  }
  const bodyText = await res.text().catch(() => "");
  if (!res.ok) {
    throw new ParseError(`HTTP ${res.status}`, {
      stage: "chat",
      status: res.status,
      raw: bodyText.slice(0, 2000),
    });
  }
  let json;
  try {
    json = JSON.parse(bodyText);
  } catch {
    throw new ParseError("Response 不是 JSON", {
      stage: "chat",
      raw: bodyText.slice(0, 2000),
    });
  }
  const content = json.choices?.[0]?.message?.content || "";
  try {
    return safeParse(content);
  } catch (parseErr) {
    throw new ParseError(`返回内容不是 JSON: ${parseErr.message}`, {
      stage: "chat",
      raw: content.slice(0, 2000),
    });
  }
}

async function runTesseract(file, onProgress) {
  const Tesseract =
    (await import("tesseract.js")).default || (await import("tesseract.js"));
  const { data } = await Tesseract.recognize(file, "eng+chi_sim+jpn", {
    logger: (m) => {
      if (m.status === "recognizing text" && typeof m.progress === "number") {
        onProgress?.(`OCR ${Math.round(m.progress * 100)}%`);
      }
    },
  });
  return data.text;
}

/**
 * parseTimetable(file, { onProgress })
 *  - 没 key → mock
 *  - 有 key：先 vision，失败回退 OCR + chat
 *  - 全失败：抛出包含两段错误的 Error，UI 可以显示 raw response
 *
 * 返回 { festival, performances, _debug? }
 */
export async function parseTimetable(file, { onProgress } = {}) {
  const cfg = getVisionConfig();
  if (!cfg.key) {
    // 不做 mock：没配 API 就不该走到这一步（上传入口已锁），走许愿流程
    throw new ParseError("未配置 AI 识别 API · 在上传页设置 key，或用许愿功能让站长代录");
  }

  let visionErr;
  if (cfg.vision) {
    try {
      onProgress?.(`用 ${cfg.model} 直读图片…`);
      const result = await callVision(file, cfg, onProgress);
      return { ...result, _debug: { ...(result._debug || {}), stage: "vision" } };
    } catch (err) {
      visionErr = err;
      console.warn("[parse] vision failed:", err);
    }
  } else {
    visionErr = new ParseError(`${cfg.model} 不支持看图 · 直接走 OCR`, {
      stage: "vision",
    });
  }

  let ocrErr;
  try {
    onProgress?.(
      cfg.vision
        ? `vision 失败 · 切换 OCR：${visionErr.message.slice(0, 60)}`
        : "该模型不支持看图 · 用 OCR 提取文字…",
    );
    const text = await runTesseract(file, onProgress);
    onProgress?.(`OCR 文本送 ${cfg.model} 整理…`);
    const result = await callChat(text, cfg);
    return {
      ...result,
      _debug: {
        stage: "ocr+chat",
        visionError: extractErr(visionErr),
        ocrTextSample: text.slice(0, 400),
      },
    };
  } catch (err) {
    ocrErr = err;
    console.warn("[parse] OCR+chat failed:", err);
  }

  // 两条路都挂了——抛出聚合错误
  const aggError = new Error("两条识别路径都失败了");
  aggError.vision = extractErr(visionErr);
  aggError.ocrChat = extractErr(ocrErr);
  throw aggError;
}

function extractErr(err) {
  if (!err) return null;
  return {
    message: err.message,
    stage: err.stage,
    status: err.status,
    raw: err.raw,
  };
}

/**
 * testConnection(cfg) — 发一条最小请求验证 地址+模型+key 三件套是否配对。
 * 不用等上传海报才发现配置错了。返回 { ok, message }。
 */
export async function testConnection(cfg) {
  if (!cfg.key?.trim()) return { ok: false, message: "还没填 API key" };
  let res;
  try {
    res = await fetch(cfg.url, {
      method: "POST",
      headers: buildHeaders(cfg),
      body: JSON.stringify({
        model: cfg.model,
        messages: [{ role: "user", content: "回复 ok 两个字母即可" }],
        max_tokens: 8,
      }),
    });
  } catch (e) {
    return {
      ok: false,
      message: `连不上（跨域或断网）· ${e.message} · 换 OpenRouter 或检查网络`,
    };
  }
  const text = await res.text().catch(() => "");
  if (!res.ok) {
    let detail = text.slice(0, 100);
    try {
      const j = JSON.parse(text);
      detail = j.error?.message || j.message || detail;
    } catch {}
    const hint =
      res.status === 401 ? "（key 不对或跟厂商不匹配）"
      : res.status === 404 ? "（模型名不存在）"
      : res.status === 429 ? "（限流或余额不足）"
      : "";
    return { ok: false, message: `HTTP ${res.status} ${hint} · ${String(detail).slice(0, 90)}` };
  }
  return { ok: true, message: `✓ 连通 · ${cfg.model} 响应正常` };
}
