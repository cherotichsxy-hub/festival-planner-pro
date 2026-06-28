// 时间表解析：优先 DeepSeek vision，回退 Tesseract OCR + DeepSeek chat。
// 没有 API key 时给一份 mock 数据，让用户能跑通完整流程。
//
// 注意：DeepSeek 官方的 deepseek-chat / deepseek-reasoner 都是纯文本模型，
// 直接吃 image_url content block 会返回 400 之类。真正的视觉模型走 SiliconFlow
// 等第三方 endpoint。这里默认就请求 deepseek-chat，失败时 raw 显示出来让用户排查。

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const VISION_MODEL = "deepseek-chat";

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
- 跨午夜场：例如 7/24 23:30 ~ 25:00 → displayDate "2026-07-24"，startAt "2026-07-24T23:30:00"，endAt "2026-07-25T01:00:00"。
- 时间一律 24 小时制，且补到分钟。
- 只输出 JSON 本体，不要 markdown 代码块，不要任何解释文字。`;

function getApiKey() {
  try {
    return localStorage.getItem("me:deepseek_api_key") || "";
  } catch {
    return "";
  }
}

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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

async function callDeepSeekVision(file, apiKey) {
  const dataUrl = await fileToDataUrl(file);
  let res;
  try {
    res = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        messages: [
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: dataUrl } },
              { type: "text", text: SCHEMA_PROMPT },
            ],
          },
        ],
        temperature: 0,
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

async function callDeepSeekChat(ocrText, apiKey) {
  let res;
  try {
    res = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: `${SCHEMA_PROMPT}\n\n以下是 OCR 抓到的文字，请尽你所能还原结构：\n\n${ocrText}`,
          },
        ],
        temperature: 0,
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

function mockResult() {
  return {
    festival: {
      name: "示例音乐节 2026",
      year: 2026,
      location: "（请去个人中心填 DeepSeek API key 后重新上传）",
      dates: ["2026-08-08", "2026-08-09"],
      stages: ["主舞台", "二舞台"],
    },
    performances: [
      {
        artistName: "示例艺人 A",
        stageName: "主舞台",
        displayDate: "2026-08-08",
        startAt: "2026-08-08T20:00:00",
        endAt: "2026-08-08T21:00:00",
      },
      {
        artistName: "示例艺人 B",
        stageName: "二舞台",
        displayDate: "2026-08-08",
        startAt: "2026-08-08T20:00:00",
        endAt: "2026-08-08T20:45:00",
      },
    ],
    _mock: true,
  };
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
  const apiKey = getApiKey();
  if (!apiKey) {
    onProgress?.("没有 API key · 用 mock 数据演示流程");
    await new Promise((r) => setTimeout(r, 600));
    return mockResult();
  }

  let visionErr;
  try {
    onProgress?.("用 DeepSeek vision 直读图片…");
    const result = await callDeepSeekVision(file, apiKey);
    return { ...result, _debug: { stage: "vision" } };
  } catch (err) {
    visionErr = err;
    console.warn("[parse] vision failed:", err);
  }

  let ocrErr;
  try {
    onProgress?.(`vision 失败 · 切换 OCR：${visionErr.message.slice(0, 60)}`);
    const text = await runTesseract(file, onProgress);
    onProgress?.("OCR 文本送 DeepSeek 整理…");
    const result = await callDeepSeekChat(text, apiKey);
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
