import React, { useMemo, useState } from "react";
import {
  parseTimetable,
  getVisionConfig,
  saveVisionConfig,
  testConnection,
  PROVIDERS,
} from "../lib/parseTimetable.js";
import { backend } from "../lib/backend.js";
import { useI18n } from "../lib/i18n.js";

// 许愿邮件收件人（站长人工代录 · 仅本地模式的 mailto 兜底用）
const WISH_EMAIL = "axisxyxy@gmail.com";

// 五阶段：idle → parsing → review (左原图 + 右可编辑 lineup) → publishing
//                                ↓
//                              error (含 raw response)

export default function UploadScreen({ onBack, onPublish, festivals = [], onOpenFestival }) {
  const { t } = useI18n();
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
    setProgress(t("parse.ready"));
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
        <button className="back-btn" onClick={onBack} aria-label={t("login.close")}>‹</button>
        <div className="upload-header-main">
          <span className="u-mono upload-channel">FESTIVAL · NEW</span>
          <h1 className="upload-title">
            UPLOAD<br />POSTER<span className="brand-title-dot">.</span>
          </h1>
        </div>
        {canPublish && (
          <button type="button" className="publish-btn" onClick={publish}>
            {t("upload.publish")}<br /><span>PUBLISH ↗</span>
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
  const { t } = useI18n();
  // API 没配好就锁住上传入口（保存 key 后 ApiConfigSection 会通知刷新）
  const [, setCfgVersion] = useState(0);
  const hasKey = !!getVisionConfig().key.trim();

  return (
    <>
      {/* Step 0：先搜一下，别人可能已经传过了 */}
      <DupSearch festivals={festivals} onOpenFestival={onOpenFestival} />

      <div className="upload-divider u-mono">
        <span>{t("upload.orUpload")}</span>
      </div>

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
          <span className="dropzone-title">{t("upload.pickPoster")}</span>
          <span className="u-mono dropzone-sub">{t("upload.posterHint")}</span>
        </label>
      ) : (
        <div className="dropzone dropzone-locked" aria-disabled="true">
          <span className="dropzone-mark">🔒</span>
          <span className="dropzone-title">{t("upload.lockedTitle")}</span>
          <span className="u-mono dropzone-sub">
            {t("upload.lockedSub")}
          </span>
        </div>
      )}

      {/* API 配置：识别真海报需要，就近放在上传流程里 */}
      <ApiConfigSection onSaved={() => setCfgVersion((v) => v + 1)} />

      <div className="upload-divider u-mono">
        <span>{t("upload.cantConfig")}</span>
      </div>

      <WishSection />
    </>
  );
}

/* ---------------- Step 0：查重搜索 ---------------- */

function DupSearch({ festivals = [], onOpenFestival }) {
  const { t } = useI18n();
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
        {t("upload.step0")}
      </p>
      <div className="search-bar dup-search-bar">
        <span className="u-mono search-label">FIND</span>
        <input
          type="search"
          placeholder={t("home.search")}
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
                  {f.year} · {f.location || "—"} · {t("upload.added")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {trimmed && hits.length === 0 && (
        <p className="dup-search-none u-mono">
          {t("upload.dupNone")}
        </p>
      )}
    </section>
  );
}

/* ---------------- API 配置（上传流程内嵌） ---------------- */

function ApiConfigSection({ onSaved }) {
  const { t } = useI18n();
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
            {t("upload.apiConfig")} · {hasKey ? t("upload.configured", { name: providerLabel }) : t("upload.notConfigured")}
          </span>
        </span>
        <span className="u-mono">{open ? t("upload.collapse2") : t("upload.set")}</span>
      </button>

      {open && (
        <div className="upload-api-body">
          <p className="api-key-hint u-mono">
            {t("upload.apiIntro")}
          </p>
          <label className="u-mono">{t("upload.whichAi")}</label>
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
                {t("upload.readImgWith", { model: preset.model, where: preset.keyHint })}
              </p>
              {preset.note && (
                <p className="api-key-hint u-mono api-key-note">{preset.note}</p>
              )}
            </>
          )}

          {isCustom && (
            <>
              <label className="u-mono">{t("upload.baseUrl")}</label>
              <input
                className="confirm-input"
                value={cfg.url}
                placeholder="https://api.example.com/v1"
                onChange={(e) => setCfg({ ...cfg, url: e.target.value })}
              />
              <p className="api-key-hint u-mono">
                {t("upload.baseUrlHint")}
              </p>
              <label className="u-mono">{t("upload.modelName")}</label>
              <input
                className="confirm-input"
                value={cfg.model}
                placeholder="qwen-vl-plus / gpt-4o-mini"
                onChange={(e) => setCfg({ ...cfg, model: e.target.value })}
              />
              <p className="api-key-hint u-mono">
                {t("upload.modelHint")}
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
              {t("upload.save")}
            </button>
            <button
              type="button"
              className="api-key-toggle"
              onClick={runTest}
              disabled={testState === "testing"}
            >
              {testState === "testing" ? t("upload.testing") : t("upload.test")}
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
              {t("upload.saved", { msg: hasKey ? t("upload.savedOn") : t("upload.savedOff") })}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

/* ---------------- 许愿（非技术用户：发邮件让站长代录） ---------------- */

function WishSection() {
  const { t } = useI18n();
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
      setErr(t("upload.wishTooSoon"));
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
          {t("upload.wishDone", { name: name.trim() })}<br />
          <span className="u-mono">{t("upload.wishDoneSub")}</span>
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
          {t("upload.wishAgain")}
        </button>
      </section>
    );
  }

  return (
    <section className="wish-card">
      <p className="api-key-hint u-mono" style={{ margin: 0 }}>
        {t("upload.wishHint")}
      </p>
      <div className="wish-fields">
        <input
          className="confirm-input"
          placeholder={t("upload.wishName")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="wish-row">
          <input
            className="confirm-input wish-year"
            type="number"
            placeholder={t("upload.wishYear")}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <input
            className="confirm-input"
            placeholder={t("upload.wishLink")}
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
          {busy ? t("upload.wishSubmitting") : t("upload.wishSubmit")}
        </button>
      ) : (
        <a
          className={`wish-send${canWish ? "" : " disabled"}`}
          href={canWish ? mailtoHref : undefined}
          onClick={(e) => {
            if (!canWish) e.preventDefault();
          }}
        >
          {t("upload.wishMail")}
        </a>
      )}
      {err && <p className="api-key-hint u-mono" style={{ color: "var(--bauhaus-red)" }}>{err}</p>}
    </section>
  );
}

function ParsingView({ progress }) {
  const { t } = useI18n();
  return (
    <div className="parsing-view">
      <div className="parsing-spinner" />
      <p className="u-mono parsing-status">{progress || t("parse.parsing")}</p>
      <p className="u-mono parsing-hint">
        {t("parse.parsingHint")}
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
  const { t } = useI18n();
  const setMetaField = (k) => (e) => setMeta({ ...meta, [k]: e.target.value });

  function setPerfField(idx, key, value) {
    setPerfs((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: value };
      return next;
    });
  }
  // 删除要点两下：第一下变红问"确认?"，2.5 秒不点自动复原——防手滑误删
  const [confirmDel, setConfirmDel] = useState(null);
  useEffect(() => {
    if (confirmDel == null) return;
    const timer = setTimeout(() => setConfirmDel(null), 2500);
    return () => clearTimeout(timer);
  }, [confirmDel]);
  function removePerf(idx) {
    setPerfs((prev) => prev.filter((_, i) => i !== idx));
    setConfirmDel(null);
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
            <span className="u-mono">{t("review.compare")}</span>
            <div className="review-compare-btns">
              {compareOpen && (
                <>
                  <button type="button" onClick={() => setZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))} aria-label={t("review.compareShrink")}>−</button>
                  <span className="u-mono review-compare-zoom">{zoom}x</span>
                  <button type="button" onClick={() => setZoom((z) => Math.min(4, +(z + 0.5).toFixed(1)))} aria-label={t("review.compareZoom")}>＋</button>
                </>
              )}
              <a href={imageUrl} target="_blank" rel="noopener noreferrer">{t("review.viewOriginal")}</a>
              <button type="button" onClick={() => setCompareOpen((v) => !v)}>
                {compareOpen ? t("review.collapse") : t("review.expand")}
              </button>
            </div>
          </div>
          {compareOpen && (
            <div className="review-compare-viewport">
              <img
                src={imageUrl}
                alt={t("review.posterAlt")}
                style={{ width: `${zoom * 100}%` }}
              />
            </div>
          )}
        </section>
      )}

      {/* 元数据 */}
      <section className="review-poster">
        <div className="review-meta">
          <label className="u-mono">{t("review.name")}</label>
          <input
            className="confirm-input"
            value={meta.name}
            onChange={setMetaField("name")}
            placeholder={t("review.namePh")}
          />
          <div className="review-meta-row">
            <div style={{ flex: "0 0 90px" }}>
              <label className="u-mono">{t("review.year")}</label>
              <input
                className="confirm-input"
                value={meta.year}
                type="number"
                onChange={setMetaField("year")}
              />
            </div>
            <div style={{ flex: "1 1 auto" }}>
              <label className="u-mono">{t("review.location")}</label>
              <input
                className="confirm-input"
                value={meta.location || ""}
                onChange={setMetaField("location")}
                placeholder="City · Venue"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 日期 / 舞台编辑（逗号分隔的简易行） */}
      <section className="review-tags">
        <ChipsField
          label={t("review.dates", { n: meta.dates?.length || 0 })}
          values={meta.dates}
          placeholder="YYYY-MM-DD"
          onChange={(arr) => setMeta({ ...meta, dates: arr })}
        />
        <ChipsField
          label={t("review.stages", { n: meta.stages?.length || 0 })}
          values={meta.stages}
          placeholder={t("review.stagePh")}
          onChange={(arr) => setMeta({ ...meta, stages: arr })}
        />
      </section>

      {/* 演出列表 - 核心：每条可编辑 */}
      <section className="review-perfs">
        <header className="review-perfs-head">
          <span className="u-mono">
            {t("review.perfs", { n: perfs.length })}
          </span>
          <button
            type="button"
            className="review-add-row"
            onClick={addPerf}
          >
            {t("review.addRow")}
          </button>
        </header>

        {perfs.length === 0 ? (
          <p className="rack-empty u-mono">
            {t("review.emptyPerfs")}
          </p>
        ) : (
          <ul className="review-perf-list">
            {perfs.map((p, idx) => (
              <li key={p._key || idx} className="review-perf-row">
                <input
                  className="confirm-input perf-name"
                  value={p.artistName || ""}
                  placeholder={t("review.artist")}
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
                    <option value="">{t("review.stagePh")}</option>
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
                    <option value="">{t("review.datePh")}</option>
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
                    className={`perf-remove${confirmDel === idx ? " arming" : ""}`}
                    onClick={() =>
                      confirmDel === idx ? removePerf(idx) : setConfirmDel(idx)
                    }
                    aria-label={confirmDel === idx ? t("review.confirmDel") : t("plan.unmark")}
                  >
                    {confirmDel === idx ? t("review.confirmDel") : "✕"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button type="button" className="confirm-restart" onClick={onRestart}>
        {t("review.restart")}
      </button>
    </div>
  );
}

function ChipsField({ label, values = [], placeholder, onChange }) {
  const { t } = useI18n();
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
        {t("review.chipsHint")}
      </small>
    </div>
  );
}

/* ---------------- Error (raw response 显示) ---------------- */

function ErrorView({ error, onRetry }) {
  const { t } = useI18n();
  const [showRaw, setShowRaw] = useState(false);
  return (
    <div className="upload-error-card">
      <p className="upload-error-tag u-mono">⚠ {t("parse.parseFail")}</p>
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
        {t("plan.retry")}
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
