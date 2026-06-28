import React, { useState } from "react";
import { parseTimetable } from "../lib/parseTimetable.js";

// 五阶段：idle → parsing → review (左原图 + 右可编辑 lineup) → publishing
//                                ↓
//                              error (含 raw response)

export default function UploadScreen({ onBack, onPublish }) {
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [meta, setMeta] = useState(null);
  const [perfs, setPerfs] = useState([]);
  const [error, setError] = useState(null);

  async function pickFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    setImageUrl(url);
    setPhase("parsing");
    setError(null);
    setProgress("准备图片…");
    try {
      const result = await parseTimetable(file, { onProgress: setProgress });
      setParsed(result);
      setMeta({
        name: result.festival?.name || "",
        year: result.festival?.year || new Date().getFullYear(),
        location: result.festival?.location || "",
        dates: result.festival?.dates || [],
        stages: result.festival?.stages || [],
      });
      setPerfs(
        (result.performances || []).map((p, i) => ({
          ...p,
          _key: `init-${i}`,
        })),
      );
      setPhase("review");
    } catch (err) {
      console.error("[upload] parse failed", err);
      setError(err);
      setPhase("error");
    }
  }

  function publish() {
    if (!meta?.name?.trim() || perfs.length === 0) return;
    const id = slugify(`${meta.name}-${meta.year}`);
    const festival = {
      id,
      name: meta.name.trim(),
      year: Number(meta.year) || new Date().getFullYear(),
      location: meta.location?.trim() || "",
      source: parsed?._mock ? "示例数据 (mock)" : "AI 解析 + 人工校对",
      dates: dedup(meta.dates).filter(Boolean),
      stages: dedup(meta.stages).filter(Boolean),
      mainStageCount: dedup(meta.stages).filter(Boolean).length,
    };
    const performances = perfs.map((p, i) => ({
      id: `${id}-p${i + 1}`,
      festivalId: id,
      artistName: p.artistName,
      stageName: p.stageName,
      displayDate: p.displayDate,
      startAt: p.startAt,
      endAt: p.endAt,
      confidence: p.confidence ?? 0.8,
    }));
    onPublish(festival, performances);
  }

  const canPublish =
    phase === "review" && meta?.name?.trim() && perfs.length > 0;

  return (
    <div className="screen-body">
      <header className="upload-header">
        <button className="back-btn" onClick={onBack} aria-label="返回">‹</button>
        <div className="upload-header-main">
          <span className="u-mono upload-channel">FESTIVAL · NEW</span>
          <h1 className="upload-title">
            UPLOAD<br />POSTER<span className="brand-title-dot">.</span>
          </h1>
        </div>
        {canPublish && (
          <button type="button" className="publish-btn" onClick={publish}>
            发布<br /><span>PUBLISH ↗</span>
          </button>
        )}
      </header>

      <main className="upload-body">
        {phase === "idle" && <IdleView onPick={pickFile} />}
        {phase === "parsing" && <ParsingView progress={progress} />}
        {phase === "review" && (
          <ReviewView
            imageUrl={imageUrl}
            meta={meta}
            setMeta={setMeta}
            perfs={perfs}
            setPerfs={setPerfs}
            parsed={parsed}
            onRestart={() => setPhase("idle")}
          />
        )}
        {phase === "error" && (
          <ErrorView error={error} onRetry={() => setPhase("idle")} />
        )}
      </main>
    </div>
  );
}

function IdleView({ onPick }) {
  return (
    <>
      <p className="upload-hint u-mono">
        把海报或时间表截图喂给 AI · 自动整理成结构化数据 · 你左右对照逐条校对
      </p>

      <label className="dropzone">
        <span className="dropzone-corner tl" />
        <span className="dropzone-corner tr" />
        <span className="dropzone-corner bl" />
        <span className="dropzone-corner br" />
        <input
          type="file"
          accept="image/*"
          onChange={onPick}
          style={{ display: "none" }}
        />
        <span className="dropzone-mark">＋</span>
        <span className="dropzone-title">点这里选海报</span>
        <span className="u-mono dropzone-sub">JPG / PNG / WEBP · 一张就够</span>
      </label>

      <div className="upload-divider u-mono">
        <span>没填 API KEY 也能跑</span>
      </div>

      <p className="upload-hint" style={{ textAlign: "center" }}>
        没填 DeepSeek API key 时会用 mock 数据演示流程 · 去个人中心配 key 后才能识别真海报
      </p>
    </>
  );
}

function ParsingView({ progress }) {
  return (
    <div className="parsing-view">
      <div className="parsing-spinner" />
      <p className="u-mono parsing-status">{progress || "处理中…"}</p>
      <p className="u-mono parsing-hint">
        VISION 直读约 5-15 秒 · OCR 兜底可能要 30 秒+
      </p>
    </div>
  );
}

/* ---------------- Review (核心：左原图 + 右可编辑 lineup) ---------------- */

function ReviewView({
  imageUrl,
  meta,
  setMeta,
  perfs,
  setPerfs,
  parsed,
  onRestart,
}) {
  const setMetaField = (k) => (e) => setMeta({ ...meta, [k]: e.target.value });

  function setPerfField(idx, key, value) {
    setPerfs((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: value };
      return next;
    });
  }
  function removePerf(idx) {
    setPerfs((prev) => prev.filter((_, i) => i !== idx));
  }
  function addPerf() {
    const firstDate = meta.dates?.[0] || "";
    const firstStage = meta.stages?.[0] || "";
    setPerfs((prev) => [
      ...prev,
      {
        _key: `new-${Date.now()}`,
        artistName: "",
        stageName: firstStage,
        displayDate: firstDate,
        startAt: firstDate ? `${firstDate}T20:00:00` : "",
        endAt: firstDate ? `${firstDate}T21:00:00` : "",
      },
    ]);
  }

  return (
    <div className="review">
      {parsed?._mock && (
        <p className="upload-mock-banner u-mono">
          ⚠ 当前是示例数据 · 实际发布前请在个人中心填 DeepSeek API key
        </p>
      )}

      {/* 海报缩略 + 元数据，紧凑放一起 */}
      <section className="review-poster">
        {imageUrl && (
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
            <img src={imageUrl} alt="上传的海报" />
          </a>
        )}
        <div className="review-meta">
          <label className="u-mono">名称</label>
          <input
            className="confirm-input"
            value={meta.name}
            onChange={setMetaField("name")}
            placeholder="音乐节名称"
          />
          <div className="review-meta-row">
            <div style={{ flex: "0 0 90px" }}>
              <label className="u-mono">年份</label>
              <input
                className="confirm-input"
                value={meta.year}
                type="number"
                onChange={setMetaField("year")}
              />
            </div>
            <div style={{ flex: "1 1 auto" }}>
              <label className="u-mono">地点</label>
              <input
                className="confirm-input"
                value={meta.location || ""}
                onChange={setMetaField("location")}
                placeholder="城市 · 场地"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 日期 / 舞台编辑（逗号分隔的简易行） */}
      <section className="review-tags">
        <ChipsField
          label={`日期 (${meta.dates?.length || 0} 天)`}
          values={meta.dates}
          placeholder="YYYY-MM-DD"
          onChange={(arr) => setMeta({ ...meta, dates: arr })}
        />
        <ChipsField
          label={`舞台 (${meta.stages?.length || 0} 个)`}
          values={meta.stages}
          placeholder="主舞台 名"
          onChange={(arr) => setMeta({ ...meta, stages: arr })}
        />
      </section>

      {/* 演出列表 - 核心：每条可编辑 */}
      <section className="review-perfs">
        <header className="review-perfs-head">
          <span className="u-mono">
            演出列表 · {perfs.length} 条
          </span>
          <button
            type="button"
            className="review-add-row"
            onClick={addPerf}
          >
            ＋ 加一条
          </button>
        </header>

        {perfs.length === 0 ? (
          <p className="rack-empty u-mono">
            — 一条都没识别出来 · 点 ＋ 加一条 或重新上传 —
          </p>
        ) : (
          <ul className="review-perf-list">
            {perfs.map((p, idx) => (
              <li key={p._key || idx} className="review-perf-row">
                <input
                  className="confirm-input perf-name"
                  value={p.artistName || ""}
                  placeholder="艺人"
                  onChange={(e) =>
                    setPerfField(idx, "artistName", e.target.value)
                  }
                />
                <div className="perf-meta-row">
                  <select
                    className="confirm-input perf-stage"
                    value={p.stageName || ""}
                    onChange={(e) =>
                      setPerfField(idx, "stageName", e.target.value)
                    }
                  >
                    <option value="">舞台</option>
                    {meta.stages?.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <select
                    className="confirm-input perf-date"
                    value={p.displayDate || ""}
                    onChange={(e) => {
                      const d = e.target.value;
                      setPerfs((prev) => {
                        const next = [...prev];
                        const cur = next[idx];
                        next[idx] = {
                          ...cur,
                          displayDate: d,
                          startAt: setIsoDate(cur.startAt, d),
                          endAt: setIsoDate(cur.endAt, d),
                        };
                        return next;
                      });
                    }}
                  >
                    <option value="">日期</option>
                    {meta.dates?.map((d) => (
                      <option key={d} value={d}>
                        {d.slice(5)}
                      </option>
                    ))}
                  </select>
                  <input
                    className="confirm-input perf-time"
                    type="time"
                    value={isoToHM(p.startAt)}
                    onChange={(e) =>
                      setPerfField(
                        idx,
                        "startAt",
                        setIsoTime(p.startAt, p.displayDate, e.target.value),
                      )
                    }
                  />
                  <span className="perf-dash">–</span>
                  <input
                    className="confirm-input perf-time"
                    type="time"
                    value={isoToHM(p.endAt)}
                    onChange={(e) =>
                      setPerfField(
                        idx,
                        "endAt",
                        setIsoTime(p.endAt, p.displayDate, e.target.value),
                      )
                    }
                  />
                  <button
                    type="button"
                    className="perf-remove"
                    onClick={() => removePerf(idx)}
                    aria-label="删除该条"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button type="button" className="confirm-restart" onClick={onRestart}>
        ← 重新选图
      </button>
    </div>
  );
}

function ChipsField({ label, values = [], placeholder, onChange }) {
  const [text, setText] = useState(values.join(", "));
  function commit() {
    const arr = text
      .split(/[,，]\s*/)
      .map((s) => s.trim())
      .filter(Boolean);
    onChange(arr);
  }
  return (
    <div className="chips-field">
      <label className="u-mono">{label}</label>
      <input
        className="confirm-input"
        value={text}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
      />
      <small className="u-mono chips-field-hint">
        用逗号分隔多项 · 失焦自动保存
      </small>
    </div>
  );
}

/* ---------------- Error (raw response 显示) ---------------- */

function ErrorView({ error, onRetry }) {
  const [showRaw, setShowRaw] = useState(false);
  return (
    <div className="upload-error-card">
      <p className="upload-error-tag u-mono">⚠ 识别失败</p>
      <p className="upload-error-msg">{error?.message || String(error)}</p>

      {(error?.vision || error?.ocrChat) && (
        <>
          <button
            type="button"
            className="upload-error-toggle u-mono"
            onClick={() => setShowRaw((v) => !v)}
          >
            {showRaw ? "收起" : "展开"} 原始 API 返回
          </button>
          {showRaw && (
            <div className="upload-error-raw">
              {error.vision && (
                <details open>
                  <summary className="u-mono">
                    Vision 路径 · {error.vision.message}
                    {error.vision.status && ` (HTTP ${error.vision.status})`}
                  </summary>
                  <pre>{error.vision.raw || "(无 body)"}</pre>
                </details>
              )}
              {error.ocrChat && (
                <details>
                  <summary className="u-mono">
                    OCR + Chat 路径 · {error.ocrChat.message}
                    {error.ocrChat.status && ` (HTTP ${error.ocrChat.status})`}
                  </summary>
                  <pre>{error.ocrChat.raw || "(无 body)"}</pre>
                </details>
              )}
            </div>
          )}
          <p className="u-mono upload-error-hint">
            💡 DeepSeek 现在的 deepseek-chat 是纯文本模型，不接收图片 · 视觉
            模型走 SiliconFlow 等第三方
          </p>
        </>
      )}

      <button
        type="button"
        className="upload-error-retry"
        onClick={onRetry}
      >
        重试
      </button>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function isoToHM(iso) {
  if (!iso) return "";
  const m = String(iso).match(/T(\d{2}:\d{2})/);
  return m ? m[1] : "";
}

function setIsoTime(iso, displayDate, hm) {
  if (!hm) return iso;
  const date = (iso || "").slice(0, 10) || displayDate || "";
  if (!date) return iso;
  return `${date}T${hm}:00`;
}

function setIsoDate(iso, newDate) {
  if (!iso) return `${newDate}T20:00:00`;
  const hm = isoToHM(iso) || "20:00";
  return `${newDate}T${hm}:00`;
}

function dedup(arr) {
  return Array.from(new Set((arr || []).map((s) => String(s).trim())));
}

function slugify(s) {
  return String(s || "festival")
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
