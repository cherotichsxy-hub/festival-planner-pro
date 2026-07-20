import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toBlob } from "html-to-image";
import { formatHM, formatChineseMonthDay, formatMonthDay } from "../lib/time.js";
import { getStageColor } from "../lib/stages.js";
import ShareCanvas from "./ShareCanvas.jsx";
import ShareCanvasTimetable from "./ShareCanvasTimetable.jsx";
import TimetableView from "./TimetableView.jsx";
import { useI18n } from "../lib/i18n.js";
import { buildPlanRoute } from "../lib/planRoute.js";

// headliner 色块色板（5 种 dusty 变体轮换）
const HEADLINER_COLORS = ["#8b1d1d", "#7e97a8", "#1e1506", "#b76060", "#afc0cd"];

export default function MyPlanList({
  festival,
  performances,
  activeDate,
  stageFilter,
  selections,
  notes = {},
  headliners,
  axisChoice,
  conflictMap,
  onSetStatus,
  onToggleHeadliner,
  onPickAxis,
}) {
  const { t, lang } = useI18n();
  const [pickerOpen, setPickerOpen] = useState(false);
  // 分享图是否包含个人备注（默认关：备注可能是私人碎碎念，发图前主动勾选才带上）
  const [includeNotes, setIncludeNotes] = useState(false);
  const paperRef = useRef(null);
  const shareCanvasRef = useRef(null);
  const [view, setView] = useState("list");
  const [shareState, setShareState] = useState("idle"); // idle | working | preview | done | error
  const [previewBlob, setPreviewBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [shareError, setShareError] = useState(null);
  const [shareMode, setShareMode] = useState("list"); // list | timetable
  const [shareDayIndex, setShareDayIndex] = useState(0);
  const shareTimetableRef = useRef(null);

  async function handleShare(mode = shareMode, dayIdx = shareDayIndex) {
    // 主分享按钮是 onClick={handleShare}，会把点击事件当 mode 传进来——
    // 只认字符串，其余（事件对象等）回退到当前 shareMode，别把 state 写坏
    if (mode !== "list" && mode !== "timetable") mode = shareMode;
    if (typeof dayIdx !== "number") dayIdx = shareDayIndex;
    setShareState("working");
    setShareError(null);
    setShareMode(mode);
    setShareDayIndex(dayIdx);
    try {
      // 等两帧让 ShareCanvasTimetable 在切换 mode/day 后 DOM 完整
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => requestAnimationFrame(r));
      const target =
        mode === "timetable"
          ? shareTimetableRef.current?.querySelector(".share-tt-canvas")
          : shareCanvasRef.current?.querySelector(".share-canvas");
      if (!target) throw new Error(t("plan.shareFail"));
      // 等字体加载完，避免抓到无字体的画
      if (document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch (_) {}
      }
      // iOS Safari 上 canvas 总像素超 16M 会失败；pixelRatio 取 1 最稳
      const dpr = window.devicePixelRatio || 1;
      const pixelRatio = Math.min(1.5, dpr);
      // html-to-image 用 foreignObject 序列化，复杂 SVG filter（噪点）
      // 在 foreignObject 里会渲染失败导致整张图变黑。生成前临时移除，完成后恢复。
      const prevBgImage = target.style.backgroundImage;
      target.style.backgroundImage = "none";
      const bgColor = mode === "timetable" ? "#fbf9f8" : "#d6dfde";
      let blob;
      try {
        blob = await toBlob(target, {
          backgroundColor: bgColor,
          pixelRatio,
          cacheBust: true,
        });
      } finally {
        target.style.backgroundImage = prevBgImage;
      }
      if (!blob) throw new Error(t("plan.shareFail"));
      setPreviewBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
      setShareState("preview");
    } catch (err) {
      console.error("[share] failed:", err);
      const msg = err?.message || String(err) || t("plan.shareFail");
      setShareError(msg.length > 120 ? msg.slice(0, 120) + "…" : msg);
      setShareState("error");
      // error 状态不再自动消失，让用户能看到信息
    }
  }

  function closePreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewBlob(null);
    setShareState("idle");
  }

  async function confirmDownload() {
    if (!previewBlob) return;
    const filename = `im-going-to-${festival.name}-${festival.year}.png`;
    const file = new File([previewBlob], filename, { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `I'm going to ${festival.name} ${festival.year}`,
        });
      } catch (e) {
        // 用户取消分享时不算错
        if (e.name !== "AbortError") console.warn("[share] aborted:", e.message);
      }
    } else {
      const a = document.createElement("a");
      a.href = previewUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    closePreview();
  }

  const summary = useMemo(() => {
    const allMarked = performances.filter((p) => selections[p.id]);
    const perDay = festival.dates.map((date, i) => {
      const count = performances.filter(
        (p) => p.displayDate === date && selections[p.id],
      ).length;
      return { date, dayIndex: i + 1, count };
    });
    return { total: allMarked.length, perDay };
  }, [performances, selections, festival.dates]);

  const visible = useMemo(() => {
    return performances
      .filter((p) => p.displayDate === activeDate)
      .filter((p) => selections[p.id])
      .filter((p) => stageFilter === "all" || p.stageName === stageFilter)
      .sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
  }, [performances, selections, activeDate, stageFilter]);

  const planRoute = useMemo(
    () => buildPlanRoute(visible, selections, headliners || [], axisChoice || {}),
    [visible, selections, headliners, axisChoice],
  );

  const dayIndex = festival.dates.indexOf(activeDate) + 1;

  // 有没有任何"已标记且写了备注"的演出——没有就别在分享面板里摆这个开关
  const hasNotes = useMemo(
    () => performances.some((p) => selections[p.id] && notes[p.id]),
    [performances, selections, notes],
  );

  // 分享面板里切换"包含备注"：改开关并重新生成预览图
  function toggleIncludeNotes() {
    setIncludeNotes((v) => !v);
    if (shareState === "preview" || shareState === "working") {
      handleShare(shareMode, shareDayIndex);
    }
  }

  // headliners: 数组 [perfId, perfId, perfId]，从 must-see 集合里取
  const headlinerList = (headliners || []).slice(0, 3);
  const mustSeePerfs = useMemo(
    () => performances
      .filter((p) => selections[p.id] === "must")
      .sort((a, b) => new Date(a.startAt) - new Date(b.startAt)),
    [performances, selections],
  );
  const headlinerPerfs = headlinerList
    .map((id) => performances.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="myplan-stage">
      {/* Headliner 槽位区 —— 在纸张外，浮在最上面 */}
      <HeadlinerRack
        festival={festival}
        slots={[0, 1, 2].map((i) => headlinerPerfs[i] || null)}
        onOpenPicker={() => setPickerOpen(true)}
        onRemove={(perfId) => onToggleHeadliner(perfId)}
      />

      <article className="myplan-paper" ref={paperRef}>
        <header className="myplan-paper-head">
          <div className="myplan-paper-marker">
            <span className="myplan-paper-tape" />
            <span className="u-mono">RUN-OF-SHOW</span>
          </div>
          <h2 className="myplan-paper-title">
            MY<br />PLAN<span className="myplan-paper-dot">.</span>
          </h2>
          <div className="myplan-paper-meta u-mono">
            <span>{lang === "en" ? formatMonthDay(activeDate) : formatChineseMonthDay(activeDate)} · DAY {dayIndex}</span>
            <span>SET CT · {String(visible.length).padStart(2, "0")}</span>
          </div>
        </header>

        <NowNext activeDate={activeDate} primaries={planRoute.primaries} />

        <div className="myplan-paper-summary u-mono">
          {summary.perDay.map((s, i) => (
            <React.Fragment key={s.date}>
              {i > 0 && <span className="sep">/</span>}
              <span>D{s.dayIndex} · {String(s.count).padStart(2, "0")}</span>
            </React.Fragment>
          ))}
          <span className="sep">/</span>
          <span>TOTAL · {String(summary.total).padStart(2, "0")}</span>
        </div>

        <div className="myplan-view-switch u-mono" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={view === "list"}
            className={view === "list" ? "active" : ""}
            onClick={() => setView("list")}
          >
            {t("plan.list")}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === "table"}
            className={view === "table" ? "active" : ""}
            onClick={() => setView("table")}
          >
            {t("plan.timetable")}
          </button>
        </div>

        <div className="myplan-paper-divider" />

        {visible.length === 0 ? (
          <div className="myplan-paper-empty">
            <p className="u-mono">— NO SETS QUEUED FOR THIS DAY —</p>
            <p>{t("plan.goMarkFull")}</p>
          </div>
        ) : view === "table" ? (
          <TimetableView
            festival={festival}
            performances={performances}
            activeDate={activeDate}
            selections={selections}
            headliners={headliners}
            axisChoice={axisChoice || {}}
            onPickAxis={onPickAxis}
          />
        ) : (
          <ul className="myplan-rows">
            {planRoute.primaries.map((perf) => {
              const alternatives = planRoute.alternativesByPrimary[perf.id] || [];
              return (
                <React.Fragment key={perf.id}>
                  <MyPlanPrimaryRow
                    perf={perf}
                    festival={festival}
                    note={notes[perf.id] || ""}
                    hasConflict={alternatives.length > 0}
                    isMaybe={selections[perf.id] === "maybe"}
                  />
                  {alternatives.map(({ perf: alternative, conflictingPrimaryIds }) => (
                    <ConflictAlternativeRow
                      key={alternative.id}
                      perf={alternative}
                      festival={festival}
                      onPick={() => onPickAxis?.(
                        alternative.id,
                        conflictingPrimaryIds,
                      )}
                    />
                  ))}
                  {alternatives.length > 0 && <li className="myplan-tail-rule" aria-hidden />}
                </React.Fragment>
              );
            })}
          </ul>
        )}

        <div className="myplan-paper-foot">
          <div className="myplan-paper-divider dashed" />
          <div className="myplan-paper-stamp">
            <span className="u-mono">ENCORE · {festival.name} · {activeDate.replace(/-/g, ".")}</span>
            <span className="u-mono myplan-paper-barcode">|||‖|‖||‖‖|||‖|‖||</span>
          </div>
        </div>
      </article>

      {visible.length > 0 && (
        <div className="myplan-share-row">
          <button
            type="button"
            className="myplan-share-btn"
            onClick={handleShare}
            disabled={shareState === "working"}
          >
            <span className="myplan-share-arrow">↗</span>
            <span>
              {shareState === "working" && t("plan.rendering")}
              {shareState === "done" && t("plan.saved")}
              {shareState === "error" && t("plan.shareRetry")}
              {(shareState === "idle" || shareState === "preview") && t("plan.shareBtn")}
            </span>
          </button>
          {shareState === "error" && shareError && (
            <p className="myplan-share-error u-mono" role="alert">
              ⚠ {shareError}
            </p>
          )}
          <p className="myplan-share-hint">
            {t("share.slogan")}
          </p>
        </div>
      )}

      {createPortal(
        <div className="share-canvas-mount" ref={shareCanvasRef} aria-hidden>
          <ShareCanvas
            festival={festival}
            performances={performances}
            selections={selections}
            notes={includeNotes ? notes : {}}
            headliners={headlinerList}
            conflictMap={conflictMap}
          />
        </div>,
        document.body,
      )}

      {createPortal(
        <div className="share-canvas-mount" ref={shareTimetableRef} aria-hidden>
          <ShareCanvasTimetable
            festival={festival}
            performances={performances}
            selections={selections}
            headliners={headlinerList}
            axisChoice={axisChoice || {}}
          />
        </div>,
        document.body,
      )}

      {(shareState === "working" || (shareState === "preview" && previewUrl)) &&
        createPortal(
          <div className="share-preview-backdrop" onClick={closePreview}>
            <div
              className="share-preview-sheet"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="share-preview-close"
                onClick={closePreview}
                aria-label={t("plan.close")}
              >
                ✕
              </button>
              <div className="share-preview-mode" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={shareMode === "list"}
                  className={shareMode === "list" ? "active" : ""}
                  onClick={() => handleShare("list")}
                  disabled={shareState === "working"}
                >
                  {t("plan.shareModeList")}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={shareMode === "timetable"}
                  className={shareMode === "timetable" ? "active" : ""}
                  onClick={() => handleShare("timetable")}
                  disabled={shareState === "working"}
                >
                  {t("plan.shareModeTable")}
                </button>
              </div>
              {/* 备注只在行程式里排得下；时间表式是定高的时间网格，塞不进自由文字 */}
              {hasNotes && shareMode === "list" && (
                <label className="share-preview-notes-toggle">
                  <input
                    type="checkbox"
                    checked={includeNotes}
                    onChange={toggleIncludeNotes}
                    disabled={shareState === "working"}
                  />
                  <span>{t("plan.shareIncludeNotes")}</span>
                </label>
              )}
              <div className="share-preview-img-wrap">
                {shareState === "working" ? (
                  <div className="share-preview-loading">
                    <div className="share-preview-spinner" />
                    <p className="u-mono">{t("plan.renderingShort")}</p>
                  </div>
                ) : (
                  <img
                    className="share-preview-img"
                    src={previewUrl}
                    alt={t("plan.shareImg")}
                  />
                )}
              </div>
              <div className="share-preview-actions">
                <button
                  type="button"
                  className="share-preview-cancel"
                  onClick={closePreview}
                >
                  {t("plan.cancel")}
                </button>
                <button
                  type="button"
                  className="share-preview-confirm"
                  onClick={confirmDownload}
                  disabled={shareState !== "preview"}
                >
                  {t("plan.download")}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {pickerOpen && (
        <HeadlinerPicker
          festival={festival}
          mustSeePerfs={mustSeePerfs}
          headlinerList={headlinerList}
          onPick={(perfId) => onToggleHeadliner(perfId)}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}

/* ---------- Headliner Rack & Picker ---------- */

function HeadlinerRack({ festival, slots, onOpenPicker, onRemove }) {
  const { t } = useI18n();
  const filled = slots.filter(Boolean).length;
  return (
    <div className="headliner-rack">
      <div className="headliner-rack-head">
        <span className="headliner-rack-title">My Top Pick</span>
        <span className="u-mono headliner-rack-count">{filled}/3</span>
      </div>
      <div className="headliner-slots">
        {slots.map((perf, i) => {
          const color = HEADLINER_COLORS[i % HEADLINER_COLORS.length];
          if (!perf) {
            return (
              <button
                key={i}
                type="button"
                className="headliner-slot empty"
                onClick={onOpenPicker}
              >
                <span className="headliner-slot-plus">+</span>
                <small className="u-mono">SLOT {i + 1}</small>
              </button>
            );
          }
          return (
            <button
              key={i}
              type="button"
              className="headliner-slot filled"
              style={{ "--headliner-color": color }}
              onClick={() => onRemove(perf.id)}
              title={t("plan.removeConfirm")}
            >
              <strong className="headliner-name">{perf.artistName}</strong>
              <small className="u-mono headliner-meta">
                {perf.stageName} · {formatHM(perf.startAt)}
              </small>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HeadlinerPicker({ festival, mustSeePerfs, headlinerList, onPick, onClose }) {
  const { t } = useI18n();
  const remaining = 3 - headlinerList.length;
  return (
    <>
      <div className="headliner-picker-backdrop" onClick={onClose} />
      <div className="headliner-picker-sheet">
        <button
          type="button"
          className="headliner-picker-close"
          onClick={onClose}
          aria-label={t("plan.close")}
        >
          ✕
        </button>
        <div className="headliner-picker-handle" />
        <div className="headliner-picker-head">
          <h3>{t("plan.topPickTitle")}</h3>
          <small className="u-mono">
            {remaining > 0
              ? t("plan.topPickHint", { n: remaining })
              : t("plan.topPickFull")}
          </small>
        </div>
        {mustSeePerfs.length === 0 ? (
          <p className="headliner-picker-empty">{t("plan.topPickEmpty")}</p>
        ) : (
          <ul className="headliner-picker-list">
            {mustSeePerfs.map((p) => {
              const picked = headlinerList.includes(p.id);
              const disabled = !picked && remaining <= 0;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    className={`headliner-picker-item${picked ? " picked" : ""}`}
                    onClick={() => onPick(p.id)}
                    disabled={disabled}
                  >
                    <span className="headliner-picker-mark">{picked ? "★" : "○"}</span>
                    <span className="headliner-picker-main">
                      <strong>{p.artistName}</strong>
                      <small className="u-mono">{p.stageName} · {formatHM(p.startAt)}</small>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <button type="button" className="headliner-picker-done" onClick={onClose}>
          {t("plan.done")}
        </button>
      </div>
    </>
  );
}

function localIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function NowNext({ activeDate, primaries }) {
  const { t } = useI18n();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (activeDate !== localIsoDate(new Date())) return undefined;
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, [activeDate]);

  if (primaries.length === 0) return null;

  const isToday = activeDate === localIsoDate(now);
  const nowMs = now.getTime();
  const current = isToday && primaries.find(
    (perf) => new Date(perf.startAt).getTime() <= nowMs && nowMs < new Date(perf.endAt).getTime(),
  );
  const next = isToday
    ? primaries.find((perf) => new Date(perf.startAt).getTime() > nowMs)
    : primaries[0];
  const minutesUntilNext = next && isToday
    ? Math.max(0, Math.ceil((new Date(next.startAt).getTime() - nowMs) / 60000))
    : null;

  return (
    <div className={`myplan-now-next u-mono${current ? " is-live" : ""}`} aria-live="polite">
      <div className="myplan-now-next-row">
        <span className="myplan-live-dot" aria-hidden />
        <strong>
          {current
            ? `${t("plan.now")} · ${current.artistName} — ${current.stageName}`
            : isToday && next
              ? t("plan.inTransit")
              : isToday
                ? t("plan.doneToday")
                : `${t("plan.next")} · ${next.artistName} — ${formatHM(next.startAt)} · ${next.stageName}`}
        </strong>
      </div>
      {current && next && (
        <div className="myplan-now-next-row is-next">
          <span>
            {t("plan.next")} · {next.artistName} {formatHM(next.startAt)}
            {minutesUntilNext != null && `（${t("plan.minutesLater", { n: minutesUntilNext })}）`}
          </span>
        </div>
      )}
    </div>
  );
}

function MyPlanPrimaryRow({ perf, festival, note = "", hasConflict, isMaybe }) {
  const { t } = useI18n();
  const color = getStageColor(festival, perf.stageName);
  const style = {
    "--stage-solid": color.solid,
    "--stage-soft": color.soft,
    "--stage-text": color.text,
  };

  return (
    <li
      className={`myplan-primary-row${hasConflict ? " has-conflict" : ""}${isMaybe ? " is-maybe" : ""}`}
      style={style}
    >
      <div className="row-time">
        <strong>{formatHM(perf.startAt)}</strong>
        <small>—{formatHM(perf.endAt)}</small>
      </div>
      <div className="row-main">
        <strong className="row-name">
          {perf.artistName}
          {isMaybe && <span className="myplan-maybe-label">{t("plan.maybe")}</span>}
        </strong>
        <span className="row-stage">
          <span className="dot" />{perf.stageName}
        </span>
        {note && <span className="row-note">✎ {note}</span>}
      </div>
    </li>
  );
}

function ConflictAlternativeRow({ perf, festival, onPick }) {
  const { t } = useI18n();
  const color = getStageColor(festival, perf.stageName);
  return (
    <li
      className="myplan-conflict-row"
      style={{ "--stage-solid": color.solid }}
    >
      <div className="myplan-conflict-info">
        <strong className="myplan-conflict-name">{perf.artistName}</strong>
        <span className="myplan-conflict-meta">
          {t("plan.timeConflict")} · {formatHM(perf.startAt)}–{formatHM(perf.endAt)}
          <span className="myplan-conflict-stage"> · {perf.stageName}</span>
        </span>
      </div>
      <button type="button" className="myplan-conflict-swap" onClick={onPick}>
        {t("plan.switchToThis")}
      </button>
    </li>
  );
}
