import React, { useMemo, useState } from "react";
import {
  parseTimetable,
  getVisionConfig,
  saveVisionConfig,
  testConnection,
  PROVIDERS,
} from "../lib/parseTimetable.js";
import { backend } from "../lib/backend.js";

// 许愿邮件收件人（站长人工代录 · 仅本地模式的 mailto 兜底用）
const WISH_EMAIL = "axisxyxy@gmail.com";

// 五阶段：idle → parsing → review (左原图 + 右可编辑 lineup) → publishing
//                                ↓
//                              error (含 raw response)

export default function UploadScreen({ onBack, onPublish, festivals = [], onOpenFestival }) {
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
      source: "AI 解析 + 人工校对",
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
        {phase === "idle" && (
          <IdleView
            onPick={pickFile}
            festivals={festivals}
            onOpenFestival={onOpenFestival}
          />
        )}
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

function IdleView({ onPick, festivals, onOpenFestival }) {
  // API 没配好就锁住上传入口（保存 key 后 ApiConfigSection 会通知刷新）
  const [, setCfgVersion] = useState(0);
  const hasKey = !!getVisionConfig().key.trim();

  return (
    <>
      {/* Step 0：先搜一下，别人可能已经传过了 */}
      <DupSearch festivals={festivals} onOpenFestival={onOpenFestival} />

      <div className="upload-divider u-mono">
        <span>没有？上传海报识别</span>
      </div>

      <p className="upload-hint u-mono">
        把海报或时间表截图喂给 AI · 自动整理成结构化数据 · 你左右对照逐条校对
      </p>

      {hasKey ? (
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
      ) : (
        <div className="dropzone dropzone-locked" aria-disabled="true">
          <span className="dropzone-mark">🔒</span>
          <span className="dropzone-title">配好 AI 识别 API 后解锁上传</span>
          <span className="u-mono dropzone-sub">
            在下方设置里粘一个 key · 不想配就往下走许愿
          </span>
        </div>
      )}

      {/* API 配置：识别真海报需要，就近放在上传流程里 */}
      <ApiConfigSection onSaved={() => setCfgVersion((v) => v + 1)} />

      <div className="upload-divider u-mono">
        <span>不想配 API？许个愿</span>
      </div>

      <WishSection />
    </>
  );
}

/* ---------------- Step 0：查重搜索 ---------------- */

function DupSearch({ festivals = [], onOpenFestival }) {
  const [q, setQ] = useState("");
  const trimmed = q.trim().toLowerCase();
  const hits = useMemo(() => {
    if (!trimmed) return [];
    return festivals
      .filter(
        (f) =>
          f.name.toLowerCase().includes(trimmed) ||
          (f.location || "").toLowerCase().includes(trimmed) ||
          String(f.year || "").includes(trimmed),
      )
      .slice(0, 5);
  }, [festivals, trimmed]);

  return (
    <section className="dup-search">
      <p className="upload-hint u-mono">
        STEP 0 · 先搜一下 — 已经有人传过就不用重复上传了
      </p>
      <div className="search-bar dup-search-bar">
        <span className="u-mono search-label">FIND</span>
        <input
          type="search"
          placeholder="搜音乐节 / 城市 / 年份"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {trimmed && hits.length > 0 && (
        <ul className="dup-search-hits">
          {hits.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                className="dup-search-hit"
                onClick={() => onOpenFestival?.(f.id)}
              >
                <strong>{f.name}</strong>
                <span className="u-mono">
                  {f.year} · {f.location || "—"} · 已收录 ↗
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {trimmed && hits.length === 0 && (
        <p className="dup-search-none u-mono">
          — 还没人传过 · 往下走上传或许愿 —
        </p>
      )}
    </section>
  );
}

/* ---------------- API 配置（上传流程内嵌） ---------------- */

function ApiConfigSection({ onSaved }) {
  const [open, setOpen] = useState(false);
  const [cfg, setCfg] = useState(() => getVisionConfig());
  const [savedAt, setSavedAt] = useState(0);
  const [testState, setTestState] = useState(null); // null | "testing" | {ok, message}
  const hasKey = cfg.key.trim().length > 0;
  const isCustom = cfg.provider === "custom";
  const preset = PROVIDERS.find((p) => p.id === cfg.provider);
  const providerLabel = preset?.label || "自定义";

  function pickProvider(id) {
    setCfg((prev) => ({ ...prev, provider: id }));
    setTestState(null);
  }

  function save() {
    saveVisionConfig(cfg);
    setSavedAt(Date.now());
    onSaved?.();
  }

  async function runTest() {
    // 保存 + 用「保存后实际生效的配置」去测，避免测的和用的不一致
    saveVisionConfig(cfg);
    setSavedAt(Date.now());
    onSaved?.();
    setTestState("testing");
    const effective = getVisionConfig();
    const result = await testConnection(effective);
    setTestState(result);
  }

  return (
    <section className={`api-key-card upload-api-card${hasKey ? " active" : ""}`}>
      <button
        type="button"
        className="upload-api-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="api-key-head">
          <span className="dot" />
          <span>
            AI 识别 · {hasKey ? `已配置 ${providerLabel}` : "未配置"}
          </span>
        </span>
        <span className="u-mono">{open ? "收起 −" : "设置 +"}</span>
      </button>

      {open && (
        <div className="upload-api-body">
          <p className="api-key-hint u-mono">
            选好用哪家 · 粘上 key 就行 · key 只存本机 localStorage · 不上传
          </p>
          <label className="u-mono">用哪家的 AI</label>
          <select
            className="confirm-input"
            value={cfg.provider}
            onChange={(e) => pickProvider(e.target.value)}
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          {preset && preset.id !== "custom" && (
            <>
              <p className="api-key-hint u-mono">
                ↳ 用 {preset.model} 读图 · key 在 {preset.keyHint} 申请
              </p>
              {preset.note && (
                <p className="api-key-hint u-mono api-key-note">{preset.note}</p>
              )}
            </>
          )}

          {isCustom && (
            <>
              <label className="u-mono">API 地址（Base URL）</label>
              <input
                className="confirm-input"
                value={cfg.url}
                placeholder="https://api.example.com/v1"
                onChange={(e) => setCfg({ ...cfg, url: e.target.value })}
              />
              <p className="api-key-hint u-mono">
                任何 OpenAI 兼容接口（中转站 / OpenRouter / 自建）· 填到 /v1 即可，
                会自动补全 /chat/completions
              </p>
              <label className="u-mono">模型名</label>
              <input
                className="confirm-input"
                value={cfg.model}
                placeholder="如 qwen-vl-plus / gpt-4o-mini"
                onChange={(e) => setCfg({ ...cfg, model: e.target.value })}
              />
              <p className="api-key-hint u-mono">
                必须是能看图的视觉模型 · 名字以服务商的模型列表为准
              </p>
            </>
          )}

          <label className="u-mono">API KEY</label>
          <div className="api-key-row">
            <input
              type="password"
              placeholder="sk-xxxxxxxxxxxx"
              value={cfg.key}
              onChange={(e) => setCfg({ ...cfg, key: e.target.value })}
              autoComplete="off"
              spellCheck={false}
            />
            <button type="button" className="api-key-save" onClick={save}>
              保存
            </button>
            <button
              type="button"
              className="api-key-toggle"
              onClick={runTest}
              disabled={testState === "testing"}
            >
              {testState === "testing" ? "测…" : "测试"}
            </button>
          </div>
          {testState && testState !== "testing" && (
            <p
              className="api-key-hint u-mono"
              style={{ color: testState.ok ? "var(--bauhaus-green, #5e6a4e)" : "var(--bauhaus-red)" }}
            >
              {testState.message}
            </p>
          )}
          {savedAt > 0 && !testState && (
            <p className="api-key-hint u-mono">
              已保存 · {hasKey ? "现在上传的海报会走真实识别" : "已清空 key"}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

/* ---------------- 许愿（非技术用户：发邮件让站长代录） ---------------- */

function WishSection() {
  const cloudOn = backend.mode !== "local";
  const [name, setName] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const canWish = name.trim().length > 0;

  // 云端模式：表单直接入库，站长后台可见，用户零操作成本
  async function submit() {
    // 轻量防连点：一分钟一个愿望
    const last = Number(localStorage.getItem("me:last_wish") || 0);
    if (Date.now() - last < 60000) {
      setErr("收到过啦 · 一分钟后可以再许下一个");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      await backend.wishes.submit({
        festivalName: name.trim(),
        year: year.trim(),
        link: link.trim(),
      });
      localStorage.setItem("me:last_wish", String(Date.now()));
      setDone(true);
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  // 本地模式的兜底：mailto
  const subject = `[FP-WISH] ${name.trim()} ${year.trim()}`.trim();
  const mailBody = [
    "想在 Festival Planner 里看到这个音乐节：",
    "",
    `音乐节：${name.trim()}`,
    `年份：${year.trim()}`,
    `官方链接/购票页：${link.trim() || "（没有）"}`,
  ].join("\n");
  const mailtoHref = `mailto:${WISH_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;

  if (done) {
    return (
      <section className="wish-card">
        <p className="wish-done">
          ✓ 收到「{name.trim()}」的愿望了！<br />
          <span className="u-mono">录入后刷新首页就能看到 · 欢迎常回来看看</span>
        </p>
        <button
          type="button"
          className="wish-again"
          onClick={() => {
            setDone(false);
            setName("");
            setLink("");
            setErr("");
          }}
        >
          ＋ 再许一个愿
        </button>
      </section>
    );
  }

  return (
    <section className="wish-card">
      <header className="api-key-head">
        <span className="dot" />
        <span>把想要的音乐节告诉我 · 我来帮你录入</span>
      </header>
      <div className="wish-fields">
        <input
          className="confirm-input"
          placeholder="音乐节名称 *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="wish-row">
          <input
            className="confirm-input wish-year"
            type="number"
            placeholder="年份"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <input
            className="confirm-input"
            placeholder="官方链接 / 购票页（选填）"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
      </div>
      {cloudOn ? (
        <button
          type="button"
          className={`wish-send${canWish ? "" : " disabled"}`}
          disabled={!canWish || busy}
          onClick={submit}
        >
          {busy ? "提交中…" : "🎋 许愿"}
        </button>
      ) : (
        <a
          className={`wish-send${canWish ? "" : " disabled"}`}
          href={canWish ? mailtoHref : undefined}
          onClick={(e) => {
            if (!canWish) e.preventDefault();
          }}
        >
          ✉ 发送许愿邮件
        </a>
      )}
      {err && <p className="api-key-hint u-mono" style={{ color: "var(--bauhaus-red)" }}>{err}</p>}
    </section>
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

  const [compareOpen, setCompareOpen] = useState(true);
  const [zoom, setZoom] = useState(1);

  return (
    <div className="review">
      {/* 原图对照面板：吸顶，改下面条目时随时能看原图 */}
      {imageUrl && (
        <section className="review-compare">
          <div className="review-compare-bar">
            <span className="u-mono">原图对照</span>
            <div className="review-compare-btns">
              {compareOpen && (
                <>
                  <button type="button" onClick={() => setZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))} aria-label="缩小">−</button>
                  <span className="u-mono review-compare-zoom">{zoom}x</span>
                  <button type="button" onClick={() => setZoom((z) => Math.min(4, +(z + 0.5).toFixed(1)))} aria-label="放大">＋</button>
                </>
              )}
              <a href={imageUrl} target="_blank" rel="noopener noreferrer">原图 ↗</a>
              <button type="button" onClick={() => setCompareOpen((v) => !v)}>
                {compareOpen ? "收起 −" : "展开 +"}
              </button>
            </div>
          </div>
          {compareOpen && (
            <div className="review-compare-viewport">
              <img
                src={imageUrl}
                alt="上传的海报"
                style={{ width: `${zoom * 100}%` }}
              />
            </div>
          )}
        </section>
      )}

      {/* 元数据 */}
      <section className="review-poster">
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
