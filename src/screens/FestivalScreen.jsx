import React, { useMemo, useState } from "react";
import LineupList from "../components/LineupList.jsx";
import MyPlanList from "../components/MyPlanList.jsx";
import { buildConflictMap } from "../lib/conflicts.js";
import { formatMonthDay, shortStageName } from "../lib/time.js";
import { getStageColor } from "../lib/stages.js";
import { useI18n } from "../lib/i18n.js";

// 本地时区的 YYYY-MM-DD（toISOString 是 UTC，跨时区会差一天）
function localIsoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function FestivalScreen({
  festival,
  performances,
  selections,
  headliners,
  axisChoice,
  onSetStatus,
  onToggleHeadliner,
  onPickAxis,
  onBack,
  initialTab = "lineup",
  initialQuery = "",
}) {
  const { t } = useI18n();
  // 现场模式：如果今天正是演出日，默认打开今天（而不是第一天）
  const todayIso = localIsoDate(new Date());
  const [activeDate, setActiveDate] = useState(
    festival.dates.includes(todayIso) ? todayIso : festival.dates[0],
  );
  const [tab, setTab] = useState(initialTab);
  const [stageFilter, setStageFilter] = useState("all");
  const [showOtherStages, setShowOtherStages] = useState(false);
  // 搜索进行中：让日期胶囊变灰，别让它假装还在起作用
  const [searchActive, setSearchActive] = useState(false);

  // 往下翻列表时收起大标题和日期条，只留返回行 + 视图切换 + 舞台筛选。
  // 两个阈值（70 收 / 12 展）防止在临界点上下抖动。
  const [compact, setCompact] = useState(false);
  function handleBodyScroll(e) {
    const y = e.currentTarget.scrollTop;
    setCompact((c) => (c ? y > 12 : y > 70));
  }
  const mainCount = festival.mainStageCount || festival.stages.length;
  const mainStages = festival.stages.slice(0, mainCount);
  const otherStages = festival.stages.slice(mainCount);

  const festivalSelections = selections || {};
  const conflictMap = useMemo(
    () => buildConflictMap(performances, festivalSelections),
    [performances, festivalSelections],
  );

  const markedCount = useMemo(
    () => performances.filter((p) => festivalSelections[p.id]).length,
    [performances, festivalSelections],
  );

  const dayIndex = festival.dates.indexOf(activeDate) + 1;

  return (
    <>
      <header className={`fest-header${compact ? " compact" : ""}`}>
        <div className="fest-header-top">
          {onBack && (
            <button className="back-btn" onClick={onBack} aria-label={t("login.close")}>‹</button>
          )}
          <span className={`fest-header-channel${compact ? " is-name" : " u-mono"}`}>
            {compact
              ? festival.name
              : `FREQ · ${festival.year} · DAY ${dayIndex}`}
          </span>
        </div>
        <div className="fest-header-full">
          <h1 className="fest-header-name">{festival.name}</h1>
          <div className="fest-header-rule" />
          <p className="u-mono fest-header-loc">
            <span>LOC</span> · {festival.location}
          </p>
        </div>
      </header>

      {/* 页面内视图切换：顶部分段控件（iOS 惯例），底部留给全局 Tab */}
      <div className="seg-bar" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "lineup"}
          className={`seg${tab === "lineup" ? " active" : ""}`}
          onClick={() => setTab("lineup")}
        >
          ♬ LINEUP
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "plan"}
          className={`seg${tab === "plan" ? " active" : ""}`}
          onClick={() => setTab("plan")}
        >
          ★ MY PLAN{markedCount > 0 ? ` (${markedCount})` : ""}
        </button>
      </div>

      {/* 日期紧跟在视图切换下面：两个视图共用，放一起才找得到。
          日期随时要切，收起头部时它不跟着收 */}
      <div className={`date-bar${searchActive ? " pills-muted" : ""}`}>
        {festival.dates.map((d) => (
          <button
            key={d}
            type="button"
            className={activeDate === d ? "active" : ""}
            onClick={() => setActiveDate(d)}
          >
            {formatMonthDay(d)}
          </button>
        ))}
      </div>

      {/* 舞台筛选只属于 LINEUP；MY PLAN 永远显示完整计划，不被它悄悄过滤 */}
      {tab === "lineup" && (
      <div className="stage-chips-bar">
        <span className="u-mono stage-chips-label">STAGE</span>
        <div className="stage-chips">
          <button
            type="button"
            className={`chip${stageFilter === "all" ? " active" : ""}`}
            onClick={() => setStageFilter("all")}
          >
            ALL
          </button>
          {mainStages.map((stage) => {
            const color = getStageColor(festival, stage);
            const active = stageFilter === stage;
            return (
              <button
                key={stage}
                type="button"
                className={`chip${active ? " active" : ""}`}
                style={{
                  "--chip-color": color.solid,
                  "--chip-soft": color.soft,
                }}
                onClick={() => setStageFilter(stage)}
              >
                {shortStageName(stage)}
              </button>
            );
          })}
          {showOtherStages && otherStages.map((stage) => {
            const color = getStageColor(festival, stage);
            const active = stageFilter === stage;
            return (
              <button
                key={stage}
                type="button"
                className={`chip chip-other${active ? " active" : ""}`}
                style={{
                  "--chip-color": color.solid,
                  "--chip-soft": color.soft,
                }}
                onClick={() => setStageFilter(stage)}
              >
                {shortStageName(stage)}
              </button>
            );
          })}
          {otherStages.length > 0 && (
            <button
              type="button"
              className="chip chip-more"
              onClick={() => {
                // 收起时如果选中的正是"更多"里的舞台，重置回 ALL——
                // 否则筛选还在生效但按钮已经看不见了
                if (showOtherStages && otherStages.includes(stageFilter)) {
                  setStageFilter("all");
                }
                setShowOtherStages((v) => !v);
              }}
              aria-expanded={showOtherStages}
            >
              {showOtherStages ? t("fest.collapse") : t("fest.more", { n: otherStages.length })}
            </button>
          )}
        </div>
      </div>
      )}

      <main className="fest-body" onScroll={handleBodyScroll}>
        {tab === "lineup" && (
          <LineupList
            festival={festival}
            performances={performances}
            activeDate={activeDate}
            stageFilter={stageFilter}
            selections={festivalSelections}
            conflictMap={conflictMap}
            onSetStatus={onSetStatus}
            initialQuery={initialQuery}
            isToday={activeDate === todayIso}
            onSearchingChange={setSearchActive}
          />
        )}
        {tab === "plan" && (
          <MyPlanList
            festival={festival}
            performances={performances}
            activeDate={activeDate}
            stageFilter="all"
            selections={festivalSelections}
            headliners={headliners}
            axisChoice={axisChoice || {}}
            conflictMap={conflictMap}
            onSetStatus={onSetStatus}
            onToggleHeadliner={onToggleHeadliner}
            onPickAxis={onPickAxis}
          />
        )}
      </main>
    </>
  );
}
