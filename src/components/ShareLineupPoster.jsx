import React, { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toBlob } from "html-to-image";
import { getStageColor } from "../lib/stages.js";
import { useI18n } from "../lib/i18n.js";

// 官方完整 lineup → 横版时间表分享海报。
// 不按 selections 过滤，画全部演出；按 festival.stages 分列，时间纵向定位。
// 复用 MyPlanList 的分享管线（toBlob → 预览 → 下载/系统分享），独立于 MyPlan 分享。

const HOUR_PX = 58;         // 每小时像素高
const COL_W = 132;          // 每个舞台列宽
const AXIS_W = 46;          // 左侧时间轴宽

function pad(n) {
  return String(n).padStart(2, "0");
}
// 演出相对当天午夜的分钟数（跨午夜场 → >1440，保证排序与定位正确）
function minutesFromMidnight(date, iso) {
  return (new Date(iso) - new Date(`${date}T00:00:00`)) / 60000;
}
function shortStage(s) {
  return s
    .replace(/\s*STAGE$/, "")
    .replace(/\s*MARQUEE$/, " MQ")
    .replace(/^FIELD OF HEAVEN$/, "FIELD")
    .replace(/^GYPSY AVALON$/, "AVALON")
    .replace(/^CRYSTAL PALACE$/, "CRYSTAL")
    .replace(/^ROOKIE A GO-GO$/, "ROOKIE")
    .replace(/^PYRAMID GARDEN$/, "PYRAMID")
    .replace(/^NAEBA SHOKUDOU$/, "SHOKUDO");
}

/* ---------------- 单天网格 ---------------- */

function DayGrid({ festival, performances, date, dayNo }) {
  const { t } = useI18n();
  // 当天所有演出（不过滤 selections）
  const dayPerfs = useMemo(
    () =>
      performances
        .filter((p) => p.displayDate === date)
        .sort((a, b) => new Date(a.startAt) - new Date(b.startAt)),
    [performances, date],
  );

  // 只保留当天真有演出的舞台，按 festival.stages 原顺序
  const stages = useMemo(() => {
    const used = new Set(dayPerfs.map((p) => p.stageName));
    return festival.stages.filter((s) => used.has(s));
  }, [festival.stages, dayPerfs]);

  // 时间范围：最早开始的整点 → 最晚结束的整点
  const range = useMemo(() => {
    if (dayPerfs.length === 0) return { minM: 600, maxM: 660 };
    let minM = Infinity;
    let maxM = -Infinity;
    for (const p of dayPerfs) {
      const s = minutesFromMidnight(date, p.startAt);
      const e = minutesFromMidnight(date, p.endAt);
      if (s < minM) minM = s;
      if (e > maxM) maxM = e;
    }
    return { minM: Math.floor(minM / 60) * 60, maxM: Math.ceil(maxM / 60) * 60 };
  }, [dayPerfs, date]);

  const totalHeight = ((range.maxM - range.minM) / 60) * HOUR_PX;
  const hours = [];
  for (let m = range.minM; m <= range.maxM; m += 60) hours.push(m);

  // 每舞台当天最后一场 = 压轴，描重
  const lastPerfId = useMemo(() => {
    const map = {};
    for (const s of stages) {
      const inStage = dayPerfs.filter((p) => p.stageName === s);
      if (inStage.length) map[s] = inStage[inStage.length - 1].id;
    }
    return map;
  }, [stages, dayPerfs]);

  const [, mo, d] = date.split("-");

  return (
    <section className="slp-day">
      <div className="slp-day-head">
        <div className="slp-day-head-l">
          <span className="u-mono slp-day-tag">DAY</span>
          <span className="slp-day-date">{Number(mo)}/{Number(d)}</span>
        </div>
        <span className="slp-day-no">{dayNo}</span>
      </div>

      <div className="slp-grid" style={{ height: `${totalHeight + 26}px` }}>
        {/* 时间轴 */}
        <div className="slp-axis" style={{ width: `${AXIS_W}px` }}>
          <div className="slp-col-head" />
          <div className="slp-axis-body" style={{ height: `${totalHeight}px` }}>
            {hours.map((m) => (
              <div
                key={m}
                className="u-mono slp-hour"
                style={{ top: `${((m - range.minM) / 60) * HOUR_PX}px` }}
              >
                {pad(Math.floor(m / 60) % 24)}
              </div>
            ))}
          </div>
        </div>

        {/* 舞台列 */}
        <div className="slp-cols">
          {stages.map((stage) => {
            const color = getStageColor(festival, stage);
            const inStage = dayPerfs.filter((p) => p.stageName === stage);
            return (
              <div key={stage} className="slp-col" style={{ width: `${COL_W}px` }}>
                <div
                  className="u-mono slp-col-head"
                  style={{ background: color.solid }}
                >
                  {shortStage(stage)}
                </div>
                <div className="slp-col-body" style={{ height: `${totalHeight}px` }}>
                  {inStage.map((p) => {
                    const s = minutesFromMidnight(date, p.startAt);
                    const e = minutesFromMidnight(date, p.endAt);
                    const top = ((s - range.minM) / 60) * HOUR_PX;
                    const h = Math.max(20, ((e - s) / 60) * HOUR_PX - 2);
                    const headliner = lastPerfId[stage] === p.id;
                    return (
                      <div
                        key={p.id}
                        className={`slp-block${headliner ? " is-top" : ""}`}
                        style={{
                          top: `${top}px`,
                          height: `${h}px`,
                          background: headliner ? color.solid : color.soft,
                          color: headliner ? "#fbf9f8" : color.text,
                          borderColor: color.solid,
                        }}
                      >
                        <span className="slp-block-name">
                          {headliner ? "★ " : ""}
                          {p.artistName}
                        </span>
                        <span className="slp-block-time">
                          {pad(Math.floor(s / 60) % 24)}:{pad(s % 60)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="u-mono slp-day-foot">
        {t("poster.stages", { n: stages.length })} · {t("poster.sets", { n: dayPerfs.length })}
      </div>
    </section>
  );
}

/* ---------------- 海报画布（供离屏截图） ---------------- */

export function LineupPosterCanvas({ festival, performances, dates }) {
  const { t } = useI18n();
  // 显式像素宽度：取各天用到的最多舞台数决定（html-to-image 的克隆算不了 max-content）
  const maxCols = useMemo(() => {
    let m = 1;
    for (const date of dates) {
      const used = new Set(
        performances.filter((p) => p.displayDate === date).map((p) => p.stageName),
      );
      const n = festival.stages.filter((s) => used.has(s)).length;
      if (n > m) m = n;
    }
    return m;
  }, [festival.stages, performances, dates]);
  const canvasWidth = 28 * 2 + AXIS_W + maxCols * COL_W;

  return (
    <div className="share-lineup-canvas" style={{ width: `${canvasWidth}px` }}>
      <span className="slp-half slp-half-tr" aria-hidden />
      <span className="slp-half slp-half-bl" aria-hidden />

      <header className="slp-masthead">
        <div>
          <div className="u-mono slp-masthead-tag">
            FREQ · {festival.year} · {t("poster.official")}
          </div>
          <h1 className="slp-masthead-name">
            {festival.name}
            <span className="slp-masthead-dot">.</span>
          </h1>
          {festival.location && (
            <div className="u-mono slp-masthead-loc">{festival.location}</div>
          )}
        </div>
      </header>

      <div className="slp-days">
        {dates.map((date) => (
          <DayGrid
            key={date}
            festival={festival}
            performances={performances}
            date={date}
            dayNo={festival.dates.indexOf(date) + 1}
          />
        ))}
      </div>

      <footer className="u-mono slp-footer">
        <span>
          {festival.name} · {festival.year}
        </span>
        <span className="slp-footer-brand">◉ FESTIVAL PLANNER</span>
      </footer>
    </div>
  );
}

/* ---------------- 分享按钮 + 预览 + 下载管线 ---------------- */

export default function LineupShareButton({ festival, performances, activeDate }) {
  const { t } = useI18n();
  const [state, setState] = useState("idle"); // idle | working | preview | error
  const [scope, setScope] = useState("day"); // day | all
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewBlob, setPreviewBlob] = useState(null);
  const [err, setErr] = useState(null);
  const mountRef = useRef(null);

  const dates = scope === "all" ? festival.dates : [activeDate];

  async function capture(nextScope) {
    setState("working");
    setErr(null);
    setScope(nextScope);
    try {
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => requestAnimationFrame(r));
      const target = mountRef.current?.querySelector(".share-lineup-canvas");
      if (!target) throw new Error(t("poster.fail"));
      // 字体就绪（系统字体一般秒好），2s 兜底防止 fonts.ready 不 resolve 卡死
      if (document.fonts && document.fonts.ready) {
        await Promise.race([
          document.fonts.ready.catch(() => {}),
          new Promise((r) => setTimeout(r, 2000)),
        ]);
      }
      // 固定宽高，避免 html-to-image 处理 max-content 时的克隆问题
      const w = target.scrollWidth;
      const h = target.scrollHeight;
      // pixelRatio 按像素预算自适应：iOS Safari canvas 上限约 16M 像素，
      // 整届长图很大，动态压 ratio 保证 w*h*ratio² < 14M，避免 iPhone 上生成失败
      const dpr = window.devicePixelRatio || 1;
      const budget = 14_000_000;
      const pixelRatio = Math.min(1.5, dpr, Math.sqrt(budget / (w * h)));
      const prevBg = target.style.backgroundImage;
      target.style.backgroundImage = "none";
      let blob;
      try {
        // skipFonts：不内联网页字体（本产品用系统字体），是宽图序列化最慢的一步，去掉快很多。
        // 15s 超时兜底，绝不无限转圈。
        blob = await Promise.race([
          toBlob(target, {
            backgroundColor: "#f4efe6",
            pixelRatio,
            cacheBust: true,
            skipFonts: true,
            width: w,
            height: h,
          }),
          new Promise((_, rej) =>
            setTimeout(() => rej(new Error(t("poster.fail"))), 15000),
          ),
        ]);
      } finally {
        target.style.backgroundImage = prevBg;
      }
      if (!blob) throw new Error(t("poster.fail"));
      setPreviewBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
      setState("preview");
    } catch (e) {
      console.error("[lineup-poster] failed:", e);
      setErr((e?.message || String(e)).slice(0, 120));
      setState("error");
    }
  }

  function close() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewBlob(null);
    setState("idle");
  }

  async function download() {
    if (!previewBlob) return;
    const filename = `${festival.name}-${festival.year}-timetable.png`;
    const file = new File([previewBlob], filename, { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: `${festival.name} ${festival.year}` });
      } catch (e) {
        if (e.name !== "AbortError") console.warn("[lineup-poster] aborted:", e.message);
      }
    } else {
      const a = document.createElement("a");
      a.href = previewUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    close();
  }

  const open = state === "working" || (state === "preview" && previewUrl) || state === "error";

  return (
    <>
      <button
        type="button"
        className="lineup-share-btn"
        onClick={() => capture("day")}
      >
        ⇱ {t("poster.share")}
      </button>

      {createPortal(
        <div className="share-canvas-mount" ref={mountRef} aria-hidden>
          <LineupPosterCanvas
            festival={festival}
            performances={performances}
            dates={dates}
          />
        </div>,
        document.body,
      )}

      {open &&
        createPortal(
          <div className="share-preview-backdrop" onClick={close}>
            <div className="share-preview-sheet" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="share-preview-close"
                onClick={close}
                aria-label={t("plan.close")}
              >
                ✕
              </button>
              <div className="share-preview-mode" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={scope === "day"}
                  className={scope === "day" ? "active" : ""}
                  onClick={() => capture("day")}
                  disabled={state === "working"}
                >
                  {t("poster.downloadDay")}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={scope === "all"}
                  className={scope === "all" ? "active" : ""}
                  onClick={() => capture("all")}
                  disabled={state === "working"}
                >
                  {t("poster.downloadAll")}
                </button>
              </div>
              <div className="share-preview-img-wrap">
                {state === "working" ? (
                  <div className="share-preview-loading">
                    <div className="share-preview-spinner" />
                    <p className="u-mono">{t("poster.rendering")}</p>
                  </div>
                ) : state === "error" ? (
                  <p className="u-mono share-preview-err">⚠ {err}</p>
                ) : (
                  <img className="share-preview-img" src={previewUrl} alt={t("poster.share")} />
                )}
              </div>
              <div className="share-preview-actions">
                <button type="button" className="share-preview-cancel" onClick={close}>
                  {t("plan.cancel")}
                </button>
                <button
                  type="button"
                  className="share-preview-confirm"
                  onClick={download}
                  disabled={state !== "preview"}
                >
                  {t("plan.download")}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
