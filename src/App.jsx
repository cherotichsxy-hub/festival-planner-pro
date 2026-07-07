import React, { useEffect, useRef, useState } from "react";
import HomeScreen from "./screens/HomeScreen.jsx";
import LoginSheet from "./components/LoginSheet.jsx";
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
  loadAttended, saveAttended,
  loadWanted, saveWanted,
  migrateIfStale,
} from "./lib/storage.js";
import { backend } from "./lib/backend.js";

// 云端个人数据与本地合并：两边都有时本地优先（本地是用户刚操作过的）
function mergeNested(cloud = {}, local = {}) {
  const out = { ...cloud };
  for (const [festId, val] of Object.entries(local)) {
    if (Array.isArray(val)) {
      const merged = Array.from(new Set([...(out[festId] || []), ...val]));
      out[festId] = merged.slice(0, 3); // headliners 上限 3
    } else if (val && typeof val === "object") {
      out[festId] = { ...(out[festId] || {}), ...val };
    } else {
      out[festId] = val;
    }
  }
  return out;
}

// 必须在 useState 初始化之前跑，否则 loadFestivals 会读到旧数据
migrateIfStale();

// dev/debug：URL ?screen=upload|profile|home 直接进入指定屏幕
function initialStack() {
  if (typeof window === "undefined") return [{ name: "home" }];
  const params = new URLSearchParams(window.location.search);
  const screen = params.get("screen");
  if (screen === "profile") return [{ name: "profile" }];
  if (screen === "upload") return [{ name: "home" }, { name: "upload" }];
  return [{ name: "home" }];
}

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
  const [attended, setAttended] = useState(() => loadAttended());
  const [wanted, setWanted] = useState(() => loadWanted());
  const [stack, setStack] = useState(() => initialStack());
  const [session, setSession] = useState(() => backend.auth.getSession());
  useEffect(() => backend.auth.onChange(setSession), []);

  // 云端：启动时拉取社区共享的音乐节，与本地/内置数据按 id 合并（云端覆盖同名）
  useEffect(() => {
    if (backend.mode === "local") return;
    let cancelled = false;
    backend.community
      .fetchAll()
      .then((rows) => {
        if (cancelled || rows.length === 0) return;
        setFestivals((prev) => {
          const map = new Map(prev.map((f) => [f.id, f]));
          for (const { festival } of rows) map.set(festival.id, festival);
          const next = Array.from(map.values());
          saveFestivals(next);
          return next;
        });
        setPerformances((prev) => {
          const cloudIds = new Set(rows.map((r) => r.festival.id));
          const kept = prev.filter((p) => !cloudIds.has(p.festivalId));
          const next = [...kept, ...rows.flatMap((r) => r.performances)];
          savePerformances(next);
          return next;
        });
      })
      .catch((e) => console.warn("[cloud] 拉取共享音乐节失败:", e));
    return () => { cancelled = true; };
  }, []); // eslint-disable-line

  // 云端：登录后拉取个人数据合并进本地
  useEffect(() => {
    if (!session?.user?.id) return;
    backend.userData
      .pull()
      .then((cloud) => {
        if (cloud.selections) setSelections((p) => { const m = mergeNested(cloud.selections, p); saveSelections(m); return m; });
        if (cloud.headliners) setHeadliners((p) => { const m = mergeNested(cloud.headliners, p); saveHeadliners(m); return m; });
        if (cloud.axisChoice) setAxisChoice((p) => { const m = mergeNested(cloud.axisChoice, p); saveAxisChoice(m); return m; });
        if (cloud.wanted) setWanted((p) => { const m = { ...cloud.wanted, ...p }; saveWanted(m); return m; });
        if (cloud.attended) setAttended((p) => { const m = { ...cloud.attended, ...p }; saveAttended(m); return m; });
      })
      .catch((e) => console.warn("[cloud] 拉取个人数据失败:", e));
  }, [session?.user?.id]); // eslint-disable-line

  // 云端：个人标注变化后 2 秒静默推送（防抖）
  const pushTimer = useRef(null);
  useEffect(() => {
    if (backend.mode === "local" || !session?.user?.id) return;
    clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => {
      backend.userData
        .push({ selections, headliners, axisChoice, wanted, attended })
        .catch((e) => console.warn("[cloud] 推送个人数据失败:", e));
    }, 2000);
    return () => clearTimeout(pushTimer.current);
  }, [selections, headliners, axisChoice, wanted, attended, session?.user?.id]); // eslint-disable-line

  const screen = stack[stack.length - 1];
  const rootTab = stack[0].name; // "home" or "profile"

  // ---- 导航与浏览器返回手势整合（iOS 边缘右滑 = 返回） ----
  // push 屏幕时同步写一条 history 记录；popstate（滑动返回/浏览器后退）→ 页面栈出栈。
  // 我们自己的 ‹ 返回按钮统一走 history.back()，两条路径行为一致。
  function push(next) {
    setStack((s) => [...s, next]);
    try { window.history.pushState({ fp: true }, ""); } catch {}
  }
  function pop() {
    if (window.history.state?.fp) {
      window.history.back(); // 触发 popstate → 真正出栈
    } else {
      setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
    }
  }
  useEffect(() => {
    const onPop = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  // 直链进入多层栈（如 ?screen=upload）时补齐 history 深度，保证返回手势可用
  useEffect(() => {
    for (let i = 1; i < stack.length; i++) {
      try { window.history.pushState({ fp: true }, ""); } catch {}
    }
  }, []); // eslint-disable-line

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
  // 右上角登录入口：未登录 → 弹登录窗（就地完成）；已登录 → 个人中心账号区（管理/退出）
  const [showLogin, setShowLogin] = useState(false);
  function openAccount() {
    if (session) setStack([{ name: "profile", focusAccount: true }]);
    else setShowLogin(true);
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
    // 已登录 → 同步发布到社区（尽力而为，失败只影响共享不影响本机）
    if (backend.mode !== "local" && backend.auth.getSession()) {
      backend.community
        .publish(newFestival, newPerformances)
        .catch((e) => console.warn("[cloud] 发布到社区失败:", e));
    }
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

  // 想看 / 去过 互斥：标了"去过"就不再是"想看"，反之亦然
  function toggleAttended(festivalId) {
    setAttended((prev) => {
      const next = { ...prev };
      if (next[festivalId]) delete next[festivalId];
      else next[festivalId] = true;
      saveAttended(next);
      return next;
    });
    setWanted((prev) => {
      if (!prev[festivalId]) return prev;
      const next = { ...prev };
      delete next[festivalId];
      saveWanted(next);
      return next;
    });
  }

  function toggleWanted(festivalId) {
    setWanted((prev) => {
      const next = { ...prev };
      if (next[festivalId]) delete next[festivalId];
      else next[festivalId] = true;
      saveWanted(next);
      return next;
    });
    setAttended((prev) => {
      if (!prev[festivalId]) return prev;
      const next = { ...prev };
      delete next[festivalId];
      saveAttended(next);
      return next;
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
            wanted={wanted}
            attended={attended}
            session={session}
            onOpenAccount={openAccount}
            onToggleWanted={toggleWanted}
            onToggleAttended={toggleAttended}
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
            performances={performances}
            selections={selections}
            attended={attended}
            wanted={wanted}
            focusAccount={!!screen.focusAccount}
            onOpenLogin={() => setShowLogin(true)}
            onOpenFestival={(id) => openFestival(id, { initialTab: "plan" })}
          />
        )}
        {screen.name === "upload" && (
          <UploadScreen
            onBack={pop}
            onPublish={publishFestival}
            festivals={festivals}
            onOpenFestival={(id) =>
              setStack((s) => [
                ...s.slice(0, -1),
                { name: "festival", festivalId: id, initialTab: "lineup" },
              ])
            }
          />
        )}

        {showLogin && <LoginSheet onClose={() => setShowLogin(false)} />}

        {/* 全局底部 Tab：常驻（iOS 惯例），进详情页也不消失。
            点当前 tab = 回到该 tab 根部；中间 ＋ 是「添加新演出」一级入口 */}
        <nav className="root-nav">
          <button
            className={rootTab === "home" ? "active" : ""}
            onClick={() => switchTab("home")}
          >
            <span className="nav-icon">⌂</span>
            首页
          </button>
          <button
            className="root-nav-add"
            onClick={() => {
              if (screen.name !== "upload") openUpload();
            }}
            aria-label="添加新演出"
          >
            ＋
          </button>
          <button
            className={rootTab === "profile" ? "active" : ""}
            onClick={() => switchTab("profile")}
          >
            <span className="nav-icon">◎</span>
            我的
          </button>
        </nav>
      </div>
    </div>
  );
}
