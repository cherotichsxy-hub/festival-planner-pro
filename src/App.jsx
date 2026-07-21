import React, { useEffect, useRef, useState } from "react";
import HomeScreen from "./screens/HomeScreen.jsx";
import LoginSheet from "./components/LoginSheet.jsx";
import ContactSheet from "./components/ContactSheet.jsx";
import FestivalScreen from "./screens/FestivalScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import UploadScreen from "./screens/UploadScreen.jsx";
import { seedFestivals, seedPerformances } from "./data/seed.js";
import {
  loadFestivals, saveFestivals,
  loadPerformances, savePerformances,
  loadSelections, saveSelections,
  loadNotes, saveNotes,
  loadHeadliners, saveHeadliners,
  loadAxisChoice, saveAxisChoice,
  loadAttended, saveAttended,
  loadWanted, saveWanted,
  migrateIfStale,
} from "./lib/storage.js";
import { backend } from "./lib/backend.js";
import { overlaps } from "./lib/conflicts.js";
import { useI18n } from "./lib/i18n.js";

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
  const [notes, setNotes] = useState(() => loadNotes());
  const [headliners, setHeadliners] = useState(() => loadHeadliners());
  const [axisChoice, setAxisChoice] = useState(() => loadAxisChoice());
  const [attended, setAttended] = useState(() => loadAttended());
  const [wanted, setWanted] = useState(() => loadWanted());
  const [stack, setStack] = useState(() => initialStack());
  const [session, setSession] = useState(() => backend.auth.getSession());
  useEffect(() => backend.auth.onChange(setSession), []);

  const { t, lang, setLang } = useI18n();
  const [desktopContactOpen, setDesktopContactOpen] = useState(false);

  // 轻量操作反馈：底部小黑条，1.8 秒自动消失
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  function showToast(text) {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  }

  // 云端：拉取社区共享的音乐节，与本地/内置数据按 id 合并（云端覆盖同名）
  const lastCommunityFetch = useRef(0);
  function fetchCommunity() {
    if (backend.mode === "local") return;
    backend.community
      .fetchAll()
      .then((rows) => {
        lastCommunityFetch.current = Date.now();
        if (rows.length === 0) return;
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
  }
  // 启动时拉一次；之后每次切回这个页面（超过 1 分钟）自动再拉，
  // 别人新发布的内容不用杀掉重开就能看到
  useEffect(() => {
    fetchCommunity();
    const refresh = () => {
      if (document.hidden) return;
      if (Date.now() - lastCommunityFetch.current < 60000) return;
      fetchCommunity();
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []); // eslint-disable-line

  // 云端：登录后拉取个人数据合并进本地
  useEffect(() => {
    if (!session?.user?.id) return;
    backend.userData
      .pull()
      .then((cloud) => {
        if (cloud.selections) setSelections((p) => { const m = mergeNested(cloud.selections, p); saveSelections(m); return m; });
        if (cloud.notes) setNotes((p) => { const m = mergeNested(cloud.notes, p); saveNotes(m); return m; });
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
        .push({ selections, notes, headliners, axisChoice, wanted, attended })
        .catch((e) => console.warn("[cloud] 推送个人数据失败:", e));
    }, 2000);
    return () => clearTimeout(pushTimer.current);
  }, [selections, notes, headliners, axisChoice, wanted, attended, session?.user?.id]); // eslint-disable-line

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
    const cloud = backend.mode !== "local";

    // 拦截 1：同 id 已存在（多半是别人已经发过这个音乐节）→ 提示，不重复发。
    // 校对页原地保留，用户可以改名或直接去看已有的那个。
    if (festivals.some((f) => f.id === newFestival.id)) {
      showToast(t("toast.festExists"));
      return;
    }

    // 拦截 2：云端模式但没登录 → 分享必须登录，别静默只存本机让用户以为分享成功了。
    // 弹登录窗，校对页原地保留，登录后再点一次 PUBLISH 即可真正发布。
    if (cloud && !backend.auth.getSession()) {
      showToast(t("toast.loginToShare"));
      setShowLogin(true);
      return;
    }

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
    if (cloud && backend.auth.getSession()) {
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
    // 即时反馈：标记成功 / 标记瞬间就告诉你撞了谁（规则同列表：必看只跟必看撞）
    if (status == null) {
      showToast(t("toast.unmarked"));
    } else {
      const me = performances.find((p) => p.id === perfId);
      const sel = selections[festivalId] || {};
      const clash =
        me &&
        performances.find(
          (p) =>
            p.id !== perfId &&
            p.festivalId === festivalId &&
            sel[p.id] &&
            (status !== "must" || sel[p.id] === "must") &&
            overlaps(me, p),
        );
      if (clash) {
        showToast(t("toast.clash", { name: clash.artistName }));
      } else {
        showToast(status === "must" ? t("toast.mustAdded") : t("toast.maybeAdded"));
      }
    }
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

  // 每场演出的个人备注（hint）。空字符串 = 删除这条备注。
  function setNote(festivalId, perfId, text) {
    const clean = (text || "").trim();
    setNotes((prev) => {
      const current = prev[festivalId] || {};
      const next = { ...current };
      if (clean) next[perfId] = clean;
      else delete next[perfId];
      const nextNotes = { ...prev };
      if (Object.keys(next).length === 0) delete nextNotes[festivalId];
      else nextNotes[festivalId] = next;
      saveNotes(nextNotes);
      return nextNotes;
    });
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
    showToast(attended[festivalId] ? t("toast.beenOff") : t("toast.beenOn"));
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
    showToast(wanted[festivalId] ? t("toast.wantOff") : t("toast.wantOn"));
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
              notes={notes[festival.id] || {}}
              headliners={headliners[festival.id] || []}
              axisChoice={axisChoice[festival.id] || {}}
              onSetStatus={(perfId, status) =>
                setStatus(festival.id, perfId, status)
              }
              onSetNote={(perfId, text) => setNote(festival.id, perfId, text)}
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
            requireLogin={backend.mode !== "local" && !session}
            onRequireLogin={() => setShowLogin(true)}
            onOpenFestival={(id) =>
              setStack((s) => [
                ...s.slice(0, -1),
                { name: "festival", festivalId: id, initialTab: "lineup" },
              ])
            }
          />
        )}

        {showLogin && <LoginSheet onClose={() => setShowLogin(false)} />}
        {desktopContactOpen && <ContactSheet onClose={() => setDesktopContactOpen(false)} />}

        {toast && (
          <div className="toast u-mono" role="status">{toast}</div>
        )}

        {/* 全局底部 Tab：常驻（iOS 惯例），进详情页也不消失。
            点当前 tab = 回到该 tab 根部。「添加新演出」不在这里——
            它是首页里的一个动作，不该抬到和"规划/我的"平级 */}
        <nav className="root-nav">
          <span className="root-nav-brand" aria-hidden="true">
            <span className="root-nav-brand-mark">EN</span>
            <span className="root-nav-brand-word">ENCORE<b>.</b></span>
          </span>
          <button
            className={rootTab === "home" ? "active" : ""}
            onClick={() => switchTab("home")}
          >
            <span className="nav-icon">⌂</span>
            {t("nav.home")}
          </button>
          <button
            className={rootTab === "profile" ? "active" : ""}
            onClick={() => switchTab("profile")}
          >
            <span className="nav-icon">◎</span>
            {t("nav.mine")}
          </button>
          <div className="desktop-utils">
            <button
              type="button"
              className="lang-chip"
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              aria-label="switch language"
            >
              {lang === "zh" ? "EN" : "中"}
            </button>
            <button
              type="button"
              className={`login-chip${session ? " on" : ""}`}
              onClick={openAccount}
            >
              {session ? (
                <>
                  <span className="login-chip-avatar">
                    {(session.user?.email || "?")[0].toUpperCase()}
                  </span>
                  {t("home.synced")}
                </>
              ) : (
                <>◎ {t("home.login")}</>
              )}
            </button>
            <button
              type="button"
              className="contact-chip"
              onClick={() => setDesktopContactOpen(true)}
              aria-label={t("contact.title")}
            >
              ✉
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
