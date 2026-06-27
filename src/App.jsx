import React, { useEffect, useState } from "react";
import HomeScreen from "./screens/HomeScreen.jsx";
import FestivalScreen from "./screens/FestivalScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import UploadScreen from "./screens/UploadScreen.jsx";
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

// 导航模型：一个 screen stack。
// 栈底永远是 home 或 profile（底部 nav 的两个根 tab）。
// festival / upload 通过 push 入栈，可用返回箭头出栈。
export default function App() {
  const [festivals, setFestivals] = useState(() => loadFestivals(seedFestivals));
  const [performances, setPerformances] = useState(() => loadPerformances(seedPerformances));
  useEffect(() => {
    saveFestivals(festivals);
    savePerformances(performances);
  }, []); // eslint-disable-line

  const [selections, setSelections] = useState(() => loadSelections());
  const [headliners, setHeadliners] = useState(() => loadHeadliners());
  const [axisChoice, setAxisChoice] = useState(() => loadAxisChoice());
  const [stack, setStack] = useState([{ name: "home" }]);

  const screen = stack[stack.length - 1];
  const rootTab = stack[0].name; // "home" or "profile"
  const canGoBack = stack.length > 1;

  function push(next) {
    setStack((s) => [...s, next]);
  }
  function pop() {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }
  function switchTab(tab) {
    setStack([{ name: tab }]);
  }

  function openFestival(festivalId, opts = {}) {
    push({
      name: "festival",
      festivalId,
      initialTab: opts.initialTab || "lineup",
    });
  }
  function openUpload() {
    push({ name: "upload" });
  }

  function publishFestival(newFestival, newPerformances) {
    setFestivals((prev) => {
      const next = [...prev, newFestival];
      saveFestivals(next);
      return next;
    });
    setPerformances((prev) => {
      const next = [...prev, ...newPerformances];
      savePerformances(next);
      return next;
    });
    // 弹出 upload 屏，推入新音乐节详情
    setStack((s) => [
      ...s.slice(0, -1),
      { name: "festival", festivalId: newFestival.id, initialTab: "lineup" },
    ]);
  }

  function setStatus(festivalId, perfId, status) {
    setSelections((prev) => {
      const current = prev[festivalId] || {};
      const next = { ...current };
      if (status == null) {
        delete next[perfId];
      } else {
        next[perfId] = status;
      }
      const nextSelections = { ...prev };
      if (Object.keys(next).length === 0) {
        delete nextSelections[festivalId];
      } else {
        nextSelections[festivalId] = next;
      }
      saveSelections(nextSelections);
      return nextSelections;
    });
    // 取消 must-see → 同步移出 headliner 列表
    if (status !== "must") {
      setHeadliners((prev) => {
        const list = prev[festivalId] || [];
        if (!list.includes(perfId)) return prev;
        const filtered = list.filter((id) => id !== perfId);
        const nextH = { ...prev };
        if (filtered.length) nextH[festivalId] = filtered;
        else delete nextH[festivalId];
        saveHeadliners(nextH);
        return nextH;
      });
    }
  }

  function pickAxis(festivalId, perfId, siblingIds) {
    setAxisChoice((prev) => {
      const cur = prev[festivalId] || {};
      const next = { ...cur };
      for (const sid of siblingIds) delete next[sid];
      next[perfId] = true;
      const nextChoice = { ...prev };
      nextChoice[festivalId] = next;
      saveAxisChoice(nextChoice);
      return nextChoice;
    });
  }

  function toggleHeadliner(festivalId, perfId) {
    setHeadliners((prev) => {
      const list = prev[festivalId] || [];
      let next;
      if (list.includes(perfId)) {
        next = list.filter((id) => id !== perfId);
      } else {
        if (list.length >= 3) return prev;
        next = [...list, perfId];
      }
      const nextH = { ...prev };
      if (next.length) nextH[festivalId] = next;
      else delete nextH[festivalId];
      saveHeadliners(nextH);
      return nextH;
    });
  }

  return (
    <div className="phone-frame">
      <div className="phone">
        {screen.name === "home" && (
          <HomeScreen
            festivals={festivals}
            performances={performances}
            selections={selections}
            onOpenFestival={openFestival}
            onOpenUpload={openUpload}
          />
        )}
        {screen.name === "festival" && (() => {
          const festival = festivals.find((f) => f.id === screen.festivalId);
          if (!festival) return null;
          const festivalPerfs = performances.filter(
            (p) => p.festivalId === festival.id,
          );
          return (
            <FestivalScreen
              festival={festival}
              performances={festivalPerfs}
              selections={selections[festival.id] || {}}
              headliners={headliners[festival.id] || []}
              axisChoice={axisChoice[festival.id] || {}}
              onSetStatus={(perfId, status) =>
                setStatus(festival.id, perfId, status)
              }
              onToggleHeadliner={(perfId) =>
                toggleHeadliner(festival.id, perfId)
              }
              onPickAxis={(perfId, siblings) =>
                pickAxis(festival.id, perfId, siblings)
              }
              onBack={pop}
              initialTab={screen.initialTab}
            />
          );
        })()}
        {screen.name === "profile" && (
          <ProfileScreen
            festivals={festivals}
            selections={selections}
            onOpenFestival={(id) => openFestival(id, { initialTab: "plan" })}
          />
        )}
        {screen.name === "upload" && (
          <UploadScreen onBack={pop} onPublish={publishFestival} />
        )}

        {/* 全局底部 nav：只有栈底（rootTab）时显示，进入二级页隐藏 */}
        {!canGoBack && (
          <nav className="root-nav">
            <button
              className={rootTab === "home" ? "active" : ""}
              onClick={() => switchTab("home")}
            >
              <span className="nav-icon">⌂</span>
              首页
            </button>
            <button
              className={rootTab === "profile" ? "active" : ""}
              onClick={() => switchTab("profile")}
            >
              <span className="nav-icon">◎</span>
              个人中心
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
