// 时间表解析：优先 DeepSeek vision，回退 Tesseract OCR + DeepSeek chat。
// 没有 API key 时给一份 mock 数据，让用户能跑通完整流程。

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
// DeepSeek 的 vision 模型名（社区主要在用 deepseek-chat，多模态走相同 endpoint）
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
  // 去除 markdown fence 之类的包裹
  const cleaned = jsonStr
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

async function callDeepSeekVision(file, apiKey) {
  const dataUrl = await fileToDataUrl(file);
  const res = await fetch(DEEPSEEK_URL, {
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
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`DeepSeek HTTP ${res.status} · ${errText.slice(0, 120)}`);
  }
  const json = await res.json();
  const content = json.choices?.[0]?.message?.content || "";
  return safeParse(content);
}

async function callDeepSeekChat(ocrText, apiKey) {
  const res = await fetch(DEEPSEEK_URL, {
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
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`DeepSeek HTTP ${res.status} · ${errText.slice(0, 120)}`);
  }
  const json = await res.json();
  return safeParse(json.choices[0].message.content);
}

async function runTesseract(file, onProgress) {
  // 动态 import 避免初始 bundle 加载 6MB worker
  const Tesseract = (await import("tesseract.js")).default || (await import("tesseract.js"));
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
  // 没 API key 时让 UI 流程跑通用的占位数据
  return {
    festival: {
      name: "示例音乐节 2026",
      year: 2026,
      location: "（请把 DeepSeek API key 填进个人中心后重新上传）",
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
 *  - 优先 DeepSeek vision
 *  - 失败回退 Tesseract OCR + DeepSeek chat
 *  - 完全没 key 时返回 mock
 */
export async function parseTimetable(file, { onProgress } = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    onProgress?.("没有 API key · 用 mock 数据演示流程");
    await new Promise((r) => setTimeout(r, 600));
    return mockResult();
  }
  try {
    onProgress?.("用 DeepSeek vision 直读图片…");
    return await callDeepSeekVision(file, apiKey);
  } catch (visionErr) {
    console.warn("[parse] vision failed, falling back to OCR:", visionErr);
    onProgress?.(`vision 失败 · 切换 OCR：${visionErr.message.slice(0, 60)}`);
    try {
      const text = await runTesseract(file, onProgress);
      onProgress?.("OCR 文本送 DeepSeek 整理…");
      return await callDeepSeekChat(text, apiKey);
    } catch (ocrErr) {
      throw new Error(
        `识别失败：vision「${visionErr.message}」· OCR「${ocrErr.message}」`,
      );
    }
  }
}
