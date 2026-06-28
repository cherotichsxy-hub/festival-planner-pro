import React, { useState } from "react";
import { parseTimetable } from "../lib/parseTimetable.js";

// 三阶段状态机：idle → parsing → confirm → publishing
// idle: 选图
// parsing: spinner
// confirm: 校对元数据 + 发布
// error: 失败提示 + 重试

export default function UploadScreen({ onBack, onPublish }) {
  const [phase, setPhase] = useState("idle"); // idle | parsing | confirm | error
  const [progress, setProgress] = useState("");
  const [parsed, setParsed] = useState(null);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState(null);

  function pickFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhase("parsing");
    setError(null);
    setProgress("准备图片…");
    parseTimetable(file, { onProgress: setProgress })
      .then((result) => {
        setParsed(result);
        setMeta({
          name: result.festival?.name || "",
          year: result.festival?.year || new Date().getFullYear(),
          location: result.festival?.location || "",
          dates: result.festival?.dates || [],
          stages: result.festival?.stages || [],
        });
        setPhase("confirm");
      })
      .catch((err) => {
        setError(err?.message || String(err));
        setPhase("error");
      });
  }

  function publish() {
    if (!parsed || !meta) return;
    const id = slugify(`${meta.name}-${meta.year}`);
    const festival = {
      id,
      name: meta.name,
      year: Number(meta.year) || new Date().getFullYear(),
      location: meta.location,
      source: parsed._mock ? "示例数据 (mock)" : "AI 解析",
      dates: meta.dates,
      stages: meta.stages,
      mainStageCount: meta.stages.length,
    };
    const performances = (parsed.performances || []).map((p, i) => ({
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
    phase === "confirm" &&
    meta?.name?.trim() &&
    (parsed?.performances?.length || 0) > 0;

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
        {phase === "confirm" && (
          <ConfirmView
            meta={meta}
            setMeta={setMeta}
            parsed={parsed}
            onRestart={() => setPhase("idle")}
          />
        )}
        {phase === "error" && (
          <ErrorView message={error} onRetry={() => setPhase("idle")} />
        )}
      </main>
    </div>
  );
}

function IdleView({ onPick }) {
  return (
    <>
      <p className="upload-hint u-mono">
        把海报或时间表截图喂给 AI · 它会自动整理成结构化数据 · 你再校对一下就能发布
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

      <p className="upload-hint u-mono" style={{ textAlign: "center" }}>
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

function ConfirmView({ meta, setMeta, parsed, onRestart }) {
  const set = (k) => (e) => setMeta({ ...meta, [k]: e.target.value });
  const perfCount = parsed.performances?.length || 0;
  return (
    <>
      {parsed._mock && (
        <p className="upload-mock-banner u-mono">
          ⚠ 当前是示例数据 · 实际发布前请在个人中心填 DeepSeek API key
        </p>
      )}

      <section className="confirm-field">
        <label className="u-mono">名称</label>
        <input className="confirm-input" value={meta.name} onChange={set("name")} />
      </section>

      <section className="confirm-field-row">
        <div className="confirm-field confirm-field-year">
          <label className="u-mono">年份</label>
          <input
            className="confirm-input"
            value={meta.year}
            type="number"
            onChange={set("year")}
          />
        </div>
        <div className="confirm-field confirm-field-grow">
          <label className="u-mono">地点</label>
          <input
            className="confirm-input"
            value={meta.location || ""}
            onChange={set("location")}
          />
        </div>
      </section>

      <section className="confirm-field">
        <label className="u-mono">
          日期 ({meta.dates?.length || 0} 天)
        </label>
        <p className="confirm-summary">
          {meta.dates?.join(" · ") || "未识别"}
        </p>
      </section>

      <section className="confirm-field">
        <label className="u-mono">
          舞台 ({meta.stages?.length || 0} 个)
        </label>
        <p className="confirm-summary">
          {meta.stages?.join(" · ") || "未识别"}
        </p>
      </section>

      <section className="confirm-count">
        <strong>{perfCount}</strong>
        <span className="u-mono">条演出已识别 · 顶部 ↗ 按钮发布</span>
      </section>

      <button type="button" className="confirm-restart" onClick={onRestart}>
        ← 重新选图
      </button>
    </>
  );
}

function ErrorView({ message, onRetry }) {
  return (
    <div className="upload-error-card">
      <p className="upload-error-tag u-mono">⚠ 识别失败</p>
      <p className="upload-error-msg">{message}</p>
      <button type="button" className="upload-error-retry" onClick={onRetry}>
        重试
      </button>
    </div>
  );
}

function slugify(s) {
  return String(s || "festival")
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
