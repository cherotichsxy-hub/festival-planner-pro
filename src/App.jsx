import React, { useEffect, useState } from "react";
import FestivalScreen from "./screens/FestivalScreen.jsx";
import ShareCanvas from "./components/ShareCanvas.jsx";
import ShareCanvasTimetable from "./components/ShareCanvasTimetable.jsx";
import { seedFestivals, seedPerformances } from "./data/seed.js";
import {
  loadFestivals, saveFestivals,
  loadPerformances, savePerformances,
  loadSelections, saveSelections,
  loadHeadliners, saveHeadliners,
  loadAxisChoice, saveAxisChoice,
  migrateIfStale,
} from "./lib/storage.js";

// 必须在 useState 初始化之前跑，否则 loadFestivals 会读到旧数据
migrateIfStale();

const FESTIVAL_ID = "fuji-rock-2026";

// Demo mode：?demo=1 时塞一份示例选择，用于截图/演示
if (typeof window !== "undefined" && window.location.search.includes("demo=1")) {
  localStorage.setItem("me:selections", JSON.stringify({
    [FESTIVAL_ID]: {
      "fr-d1-g4": "must",   // TURNSTILE
      "fr-d1-g6": "must",   // The xx
      "fr-d1-w5": "must",   // ARLO PARKS
      "fr-d1-w6": "must",   // ASIAN KUNG-FU GENERATION
      "fr-d1-r3": "must",   // SORRY
      "fr-d1-h2": "maybe",  // FIELD OF HEAVEN 待定
      "fr-d2-g4": "must",   // Day 2 GREEN
      "fr-d2-w5": "must",   // Day 2 WHITE
      "fr-d3-g4": "must",   // Day 3 GREEN
    },
  }));
  localStorage.setItem("me:headliners", JSON.stringify({
    [FESTIVAL_ID]: ["fr-d1-g6", "fr-d1-g4", "fr-d1-w6"],
  }));
}

// URL state（截图/直链用）：?view=table → 时间表视图；?tab=plan → MY PLAN；?q=xxx → 搜索词
const URL_PARAMS = typeof window !== "undefined"
  ? new URLSearchParams(window.location.search)
  : new URLSearchParams();
if (typeof window !== "undefined" && URL_PARAMS.get("view")) {
  localStorage.setItem("me:myplan_view", URL_PARAMS.get("view"));
}
// ?full=1 让 phone/fest-body 高度自适应，方便 marketing 截图整页
if (typeof window !== "undefined" && URL_PARAMS.get("full") === "1") {
  const s = document.createElement("style");
  s.textContent = `
    html, body { background: #fff; height: auto !important; }
    .phone-frame { min-height: 0 !important; padding: 0 !important; }
    .phone { height: auto !important; overflow: visible !important; min-height: 0 !important; }
    .fest-bottom-nav { position: static !important; }
    .fest-body { overflow: visible !important; }
  `;
  document.head.appendChild(s);
}

export default function App() {
  const [festivals] = useState(() => loadFestivals(seedFestivals));
  const [performances] = useState(() => loadPerformances(seedPerformances));
  useEffect(() => {
    saveFestivals(festivals);
    savePerformances(performances);
  }, []); // eslint-disable-line

  const [selections, setSelections] = useState(() => loadSelections());
  const [headliners, setHeadliners] = useState(() => loadHeadliners());
  const [axisChoice, setAxisChoice] = useState(() => loadAxisChoice());

  const festival = festivals.find((f) => f.id === FESTIVAL_ID);
  const festivalPerfs = performances.filter((p) => p.festivalId === FESTIVAL_ID);

  function setStatus(perfId, status) {
    setSelections((prev) => {
      const current = prev[FESTIVAL_ID] || {};
      const next = { ...current };
      if (status == null) {
        delete next[perfId];
      } else {
        next[perfId] = status;
      }
      const nextSelections = { ...prev };
      if (Object.keys(next).length === 0) {
        delete nextSelections[FESTIVAL_ID];
      } else {
        nextSelections[FESTIVAL_ID] = next;
      }
      saveSelections(nextSelections);
      return nextSelections;
    });
    // 取消 must-see → 同步移出 headliner 列表
    if (status !== "must") {
      setHeadliners((prev) => {
        const list = prev[FESTIVAL_ID] || [];
        if (!list.includes(perfId)) return prev;
        const filtered = list.filter((id) => id !== perfId);
        const nextH = { ...prev };
        if (filtered.length) nextH[FESTIVAL_ID] = filtered;
        else delete nextH[FESTIVAL_ID];
        saveHeadliners(nextH);
        return nextH;
      });
    }
  }

  // 撞档时把某个 perf 提到主轴（同冲突组的其它从 axisChoice 移除）
  function pickAxis(perfId, siblingIds) {
    setAxisChoice((prev) => {
      const cur = prev[FESTIVAL_ID] || {};
      const next = { ...cur };
      // 清掉同组所有兄弟（包括它自己），再 set 该 perf 为 pinned
      for (const sid of siblingIds) delete next[sid];
      next[perfId] = true;
      const nextChoice = { ...prev };
      nextChoice[FESTIVAL_ID] = next;
      saveAxisChoice(nextChoice);
      return nextChoice;
    });
  }

  function toggleHeadliner(perfId) {
    setHeadliners((prev) => {
      const list = prev[FESTIVAL_ID] || [];
      let next;
      if (list.includes(perfId)) {
        next = list.filter((id) => id !== perfId);
      } else {
        if (list.length >= 3) return prev;
        next = [...list, perfId];
      }
      const nextH = { ...prev };
      if (next.length) nextH[FESTIVAL_ID] = next;
      else delete nextH[FESTIVAL_ID];
      saveHeadliners(nextH);
      return nextH;
    });
  }

  if (!festival) return null;

  // 截图/marketing 用：?show=share-list 或 ?show=share-tt 直接渲染分享卡
  const showShare = URL_PARAMS.get("show");
  if (showShare === "share-list" || showShare === "share-tt") {
    const sel = selections[FESTIVAL_ID] || {};
    const hl = headliners[FESTIVAL_ID] || [];
    const ax = axisChoice[FESTIVAL_ID] || {};
    return (
      <div style={{ background: "#fff", padding: "24px", display: "inline-block" }}>
        {showShare === "share-list" ? (
          <ShareCanvas
            festival={festival}
            performances={festivalPerfs}
            selections={sel}
            headliners={hl}
            conflictMap={{}}
          />
        ) : (
          <ShareCanvasTimetable
            festival={festival}
            performances={festivalPerfs}
            selections={sel}
            headliners={hl}
            axisChoice={ax}
          />
        )}
      </div>
    );
  }

  return (
    <div className="phone-frame">
      <div className="phone">
        <FestivalScreen
          festival={festival}
          performances={festivalPerfs}
          selections={selections[FESTIVAL_ID] || {}}
          headliners={headliners[FESTIVAL_ID] || []}
          axisChoice={axisChoice[FESTIVAL_ID] || {}}
          onSetStatus={setStatus}
          onToggleHeadliner={toggleHeadliner}
          onPickAxis={pickAxis}
          initialTab={URL_PARAMS.get("tab") === "plan" ? "plan" : "lineup"}
          initialQuery={URL_PARAMS.get("q") || ""}
        />
      </div>
    </div>
  );
}
