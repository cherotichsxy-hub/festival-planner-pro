import React, { useState } from "react";
import { parseTimetable } from "../lib/parseTimetable.js";

// 三阶段状态机：idle → parsing → confirm → publishing
//                        ↓
//                       error

export default function UploadScreen({ onBack, onPublish }) {
  const [phase, setPhase] = useState("idle"); // idle | parsing | confirm | error
  const [progress, setProgress] = useState("");
  const [parsed, setParsed] = useState(null);
  const [meta, setMeta] = useState(null); // 用户在 confirm 阶段编辑的 festival 元数据
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

  return (
    <>
      <header className="upload-header">
        <button className="back-btn" onClick={onBack} aria-label="返回">‹</button>
        <h1 className="upload-title">UPLOAD POSTER.</h1>
        <p className="upload-sub u-mono">
          拍一张海报或选张截图 · AI 自动识别成时间表
        </p>
      </header>

      <main className="upload-body">
        {phase === "idle" && <IdleView onPick={pickFile} />}
        {phase === "parsing" && <ParsingView progress={progress} />}
        {phase === "confirm" && (
          <ConfirmView
            meta={meta}
            setMeta={setMeta}
            parsed={parsed}
            onPublish={publish}
            onRestart={() => setPhase("idle")}
          />
        )}
        {phase === "error" && (
          <ErrorView
            message={error}
            onRetry={() => setPhase("idle")}
          />
        )}
      </main>
    </>
  );
}

function IdleView({ onPick }) {
  return (
    <div className="upload-pick">
      <label className="upload-pick-zone">
        <input
          type="file"
          accept="image/*"
          onChange={onPick}
          style={{ display: "none" }}
        />
        <span className="upload-pick-mark">＋</span>
        <strong>点这里选海报图片</strong>
        <small className="u-mono">JPG / PNG / WEBP · 一张就够</small>
      </label>
      <p className="upload-hint u-mono">
        没填 DeepSeek API key 也能跑 · 会用示例数据演示流程
      </p>
    </div>
  );
}

function ParsingView({ progress }) {
  return (
    <div className="upload-parsing">
      <div className="upload-spinner" />
      <p className="u-mono">{progress || "处理中…"}</p>
      <small className="u-mono upload-parsing-hint">
        Vision 直读约 5-15 秒 · OCR 兜底可能要 30 秒+
      </small>
    </div>
  );
}

function ConfirmView({ meta, setMeta, parsed, onPublish, onRestart }) {
  const set = (k) => (e) => setMeta({ ...meta, [k]: e.target.value });
  const perfCount = parsed.performances?.length || 0;
  return (
    <div className="upload-confirm">
      {parsed._mock && (
        <p className="upload-mock-banner u-mono">
          ⚠ 示例数据 · 实际发布前请去个人中心填 DeepSeek API key
        </p>
      )}

      <section className="upload-field">
        <label className="u-mono">名称</label>
        <input value={meta.name} onChange={set("name")} />
      </section>
      <section className="upload-field upload-field-row">
        <div>
          <label className="u-mono">年份</label>
          <input
            value={meta.year}
            type="number"
            onChange={set("year")}
          />
        </div>
        <div className="upload-field-grow">
          <label className="u-mono">地点</label>
          <input value={meta.location || ""} onChange={set("location")} />
        </div>
      </section>

      <section className="upload-field">
        <label className="u-mono">日期 ({meta.dates?.length || 0} 天)</label>
        <p className="upload-list-summary">
          {meta.dates?.join(" · ") || "未识别"}
        </p>
      </section>
      <section className="upload-field">
        <label className="u-mono">舞台 ({meta.stages?.length || 0} 个)</label>
        <p className="upload-list-summary">
          {meta.stages?.join(" · ") || "未识别"}
        </p>
      </section>

      <section className="upload-summary">
        <strong>{perfCount}</strong>
        <span className="u-mono">条演出已识别</span>
      </section>

      <div className="upload-confirm-actions">
        <button
          type="button"
          className="upload-confirm-cancel"
          onClick={onRestart}
        >
          重新上传
        </button>
        <button
          type="button"
          className="upload-confirm-publish"
          onClick={onPublish}
        >
          发布 · 加到我的频道
        </button>
      </div>
    </div>
  );
}

function ErrorView({ message, onRetry }) {
  return (
    <div className="upload-error">
      <p className="u-mono">⚠ 识别失败</p>
      <p className="upload-error-msg">{message}</p>
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

function slugify(s) {
  return String(s || "festival")
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
