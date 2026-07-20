import React, { useMemo } from "react";
import { formatHM } from "../lib/time.js";
import { getStageColor } from "../lib/stages.js";
import { useI18n } from "../lib/i18n.js";
import { buildPlanRoute } from "../lib/planRoute.js";

/**
 * 时间表视图 · 当前安排 + 冲突备选
 *
 * 布局：
 *  - 时间轴 (左)
 *  - 主轴 (中, 占大宽度)：每个时段一个 main block，体现"我的行程主线"
 *  - 备选 (右, 占小宽度)：撞档时同时段的其他候选浮现成 bubble，可点击切换到主轴
 *
 * Pairwise overlaps are resolved by buildPlanRoute, so compatible sets on
 * either side of a chain conflict can both remain in the primary route.
 */
const HOUR_PX = 56;
const DAY_START_HOUR = 10;

export default function TimetableView({
  festival,
  performances,
  activeDate,
  selections,
  headliners = [],
  axisChoice = {},
  onPickAxis,
}) {
  const { t } = useI18n();
  const items = useMemo(
    () =>
      performances
        .filter((p) => p.displayDate === activeDate && selections[p.id])
        .sort((a, b) => new Date(a.startAt) - new Date(b.startAt)),
    [performances, activeDate, selections],
  );

  const { primaries, alternativesByPrimary } = useMemo(
    () => buildPlanRoute(items, selections, headliners, axisChoice),
    [items, selections, headliners, axisChoice],
  );

  // 时间范围
  const range = useMemo(() => {
    if (items.length === 0) return { minM: 0, maxM: 60 };
    const dayStart = new Date(`${activeDate}T${pad(DAY_START_HOUR)}:00:00`);
    let minM = Infinity;
    let maxM = -Infinity;
    for (const p of items) {
      const s = (new Date(p.startAt) - dayStart) / 60000;
      const e = (new Date(p.endAt) - dayStart) / 60000;
      if (s < minM) minM = s;
      if (e > maxM) maxM = e;
    }
    minM = Math.floor(minM / 60) * 60;
    maxM = Math.ceil(maxM / 60) * 60;
    return { minM, maxM };
  }, [items, activeDate]);

  if (items.length === 0) {
    return (
      <div className="timetable-empty">
        <p className="u-mono">{t("tt.emptyTitle")}</p>
        <p>{t("tt.emptyHint")}</p>
      </div>
    );
  }

  const totalMinutes = range.maxM - range.minM;
  const totalHeight = (totalMinutes / 60) * HOUR_PX;
  const hours = [];
  for (let m = range.minM; m <= range.maxM; m += 60) hours.push(m);

  const dayStart = new Date(`${activeDate}T${pad(DAY_START_HOUR)}:00:00`);
  const hasAnyBackup = Object.values(alternativesByPrimary).some(
    (alternatives) => alternatives.length > 0,
  );

  return (
    <div className="timetable-wrap">
      <div
        className="timetable-grid v2"
        style={{
          gridTemplateColumns: hasAnyBackup
            ? "52px 1fr 86px"
            : "52px 1fr",
          height: `${totalHeight}px`,
        }}
      >
        {/* 时间轴 */}
        <div className="timetable-hours" style={{ height: `${totalHeight}px` }}>
          {hours.map((m) => (
            <div
              key={m}
              className="timetable-hour-label u-mono"
              style={{ top: `${((m - range.minM) / 60) * HOUR_PX}px` }}
            >
              {formatMinuteLabel(m)}
            </div>
          ))}
        </div>

        {/* 主轴列 */}
        <div className="timetable-axis-main" style={{ height: `${totalHeight}px` }}>
          {hours.map((m) => (
            <div
              key={`gl-m-${m}`}
              className="timetable-grid-line"
              style={{ top: `${((m - range.minM) / 60) * HOUR_PX}px` }}
            />
          ))}
          {primaries.map((main) => {
            const color = getStageColor(festival, main.stageName);
            const startMin = (new Date(main.startAt) - dayStart) / 60000;
            const endMin = (new Date(main.endAt) - dayStart) / 60000;
            const top = ((startMin - range.minM) / 60) * HOUR_PX;
            const height = Math.max(((endMin - startMin) / 60) * HOUR_PX - 4, 18);
            const status = selections[main.id];
            const isHeadliner = headliners.includes(main.id);
            return (
              <article
                key={main.id}
                className={`tt-block tt-axis tt-${status}${isHeadliner ? " is-headliner" : ""}`}
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                  "--stage-solid": color.solid,
                }}
              >
                <div className="tt-block-name">
                  {isHeadliner && <span className="tt-headliner-mark" aria-hidden>★</span>}
                  {main.artistName}
                </div>
                <div className="tt-block-stage u-mono">
                  {formatHM(main.startAt)}–{formatHM(main.endAt)} · {main.stageName}
                </div>
              </article>
            );
          })}
          {primaries.slice(0, -1).map((main, index) => {
            const next = primaries[index + 1];
            const gap = Math.floor((new Date(next.startAt) - new Date(main.endAt)) / 60000);
            if (gap < 30) return null;
            const endMin = (new Date(main.endAt) - dayStart) / 60000;
            const top = ((endMin - range.minM) / 60) * HOUR_PX + 4;
            return (
              <span key={`gap-${main.id}-${next.id}`} className="tt-gap u-mono" style={{ top: `${top}px` }}>
                · {gap} MIN ·
              </span>
            );
          })}
        </div>

        {/* 备选列 */}
        {hasAnyBackup && (
          <div className="timetable-axis-backup" style={{ height: `${totalHeight}px` }}>
            {hours.map((m) => (
              <div
                key={`gl-b-${m}`}
                className="timetable-grid-line"
                style={{ top: `${((m - range.minM) / 60) * HOUR_PX}px` }}
              />
            ))}
            {primaries.flatMap((main) =>
              (alternativesByPrimary[main.id] || []).map(({ perf, conflictingPrimaryIds }) => {
                const color = getStageColor(festival, perf.stageName);
                const startMin = (new Date(perf.startAt) - dayStart) / 60000;
                const endMin = (new Date(perf.endAt) - dayStart) / 60000;
                const top = ((startMin - range.minM) / 60) * HOUR_PX;
                const height = Math.max(
                  ((endMin - startMin) / 60) * HOUR_PX - 4,
                  18,
                );
                return (
                  <button
                    key={perf.id}
                    type="button"
                    className="tt-bubble"
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      "--stage-solid": color.solid,
                    }}
                    onClick={() => {
                      if (onPickAxis) {
                        onPickAxis(perf.id, conflictingPrimaryIds);
                      }
                    }}
                    aria-label={perf.artistName + " · " + t("tt.promote")}
                    title={t("tt.promote")}
                  >
                    <span className="tt-bubble-name">{perf.artistName}</span>
                    <span className="tt-bubble-meta u-mono">
                      {formatHM(perf.startAt)}–{formatHM(perf.endAt)}
                    </span>
                  </button>
                );
              }),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatMinuteLabel(m) {
  const totalMin = DAY_START_HOUR * 60 + m;
  const h = Math.floor(totalMin / 60) % 24;
  const mm = totalMin % 60;
  return `${pad(h)}:${pad(mm)}`;
}
