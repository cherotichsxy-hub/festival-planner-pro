import React, { useEffect, useRef, useState } from "react";
import { backend } from "../lib/backend.js";

// 个人中心（豆瓣式布局）：
//   顶部 = 个人信息头（头像 + 邮箱 + 想看/待看/看过 统计 + 登录/退出）
//   下面 = 三栏列表（一个音乐节只出现在一栏，按进度归位）
//     想看  = 首页标了「想看」，还没开始做计划
//     待看  = 标注过具体演出（★/?），计划进行中（去过的除外）
//     看过  = 首页标了「去过」，附当时标过必看的艺人
// 进度天然流转：想看 → 开始标演出变待看 → 标去过变看过。

export default function ProfileScreen({
  festivals,
  performances,
  selections,
  attended,
  wanted,
  focusAccount = false,
  onOpenLogin,
  onOpenFestival,
}) {
  const hasMarks = (f) =>
    selections[f.id] && Object.keys(selections[f.id]).length > 0;

  const seenFestivals = festivals.filter((f) => attended[f.id]);
  const plannedFestivals = festivals.filter(
    (f) => !attended[f.id] && hasMarks(f),
  );
  const wantedFestivals = festivals.filter(
    (f) => wanted[f.id] && !attended[f.id] && !hasMarks(f),
  );
  const totalMarks = festivals.reduce(
    (n, f) => n + Object.keys(selections[f.id] || {}).length,
    0,
  );

  function seenArtists(f) {
    const sel = selections[f.id] || {};
    const names = performances
      .filter((p) => p.festivalId === f.id && sel[p.id] === "must")
      .map((p) => p.artistName);
    return Array.from(new Set(names));
  }

  return (
    <div className="screen-body">
      <header className="brand-bar">
        <div className="brand-bar-marker">
          <span className="brand-mark">ME</span>
          <span className="u-mono brand-bar-sys">PROFILE · ARCHIVE</span>
        </div>
        <h1 className="brand-title">
          MY<br />PLANNER<span className="brand-title-dot">.</span>
        </h1>
        <p className="brand-tagline">想看 · 待看 · 看过</p>
      </header>

      <div className="home-body">
        <ProfileHead
          autoFocus={focusAccount}
          onOpenLogin={onOpenLogin}
          stats={{
            wanted: wantedFestivals.length,
            planned: plannedFestivals.length,
            seen: seenFestivals.length,
            totalMarks,
          }}
        />

        <section className="profile-section">
          <header className="rack-title">
            <span className="u-mono">WANT / 想看</span>
            <span className="u-mono rack-count">
              {String(wantedFestivals.length).padStart(2, "0")}
            </span>
          </header>
          {wantedFestivals.length === 0 ? (
            <p className="rack-empty u-mono">
              — 在首页卡片右上角点「想看」收藏 —
            </p>
          ) : (
            <ul className="my-fest-list">
              {wantedFestivals.map((f) => (
                <li key={f.id}>
                  <div className="my-fest-card">
                    <button
                      type="button"
                      className="my-fest-main"
                      onClick={() => onOpenFestival(f.id)}
                    >
                      <strong className="my-fest-name">{f.name}</strong>
                      <span className="u-mono my-fest-loc">{f.location}</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="profile-section">
          <header className="rack-title">
            <span className="u-mono">PLANNED / 待看计划</span>
            <span className="u-mono rack-count">
              {String(plannedFestivals.length).padStart(2, "0")}
            </span>
          </header>
          {plannedFestivals.length === 0 ? (
            <p className="rack-empty u-mono">
              — 进音乐节标 ★ 必看 / ? 待定 · 计划会出现在这里 —
            </p>
          ) : (
            <ul className="my-fest-list">
              {plannedFestivals.map((f) => {
                const count = Object.keys(selections[f.id] || {}).length;
                return (
                  <li key={f.id}>
                    <div className="my-fest-card">
                      <button
                        type="button"
                        className="my-fest-main"
                        onClick={() => onOpenFestival(f.id)}
                      >
                        <strong className="my-fest-name">{f.name}</strong>
                        <span className="u-mono my-fest-loc">{f.location}</span>
                        <span className="u-mono my-fest-stat">
                          ● {count} SETS MARKED
                        </span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="profile-section">
          <header className="rack-title">
            <span className="u-mono">ATTENDED / 看过</span>
            <span className="u-mono rack-count">
              {String(seenFestivals.length).padStart(2, "0")}
            </span>
          </header>
          {seenFestivals.length === 0 ? (
            <p className="rack-empty u-mono">
              — 去过哪场就在首页点「去过」· 这里会长出你的现场履历 —
            </p>
          ) : (
            <ul className="attended-list">
              {seenFestivals.map((f) => {
                const artists = seenArtists(f);
                return (
                  <li key={f.id} className="attended-card">
                    <button
                      type="button"
                      className="attended-open"
                      onClick={() => onOpenFestival(f.id)}
                    >
                      <div className="attended-head">
                        <strong>{f.name}</strong>
                        <span className="u-mono">{f.year}</span>
                      </div>
                    </button>
                    {artists.length > 0 ? (
                      <>
                        <span className="u-mono attended-sub">
                          ● {artists.length} 组艺人
                        </span>
                        <div className="attended-artists">
                          {artists.map((a) => (
                            <span key={a} className="attended-artist">{a}</span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <span className="u-mono attended-sub">
                        没标过必看 · 去时间表里补标 ★ 就会出现在这里
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

/* ---------------- 个人信息头（豆瓣式：头像 + 身份 + 统计） ---------------- */

function ProfileHead({ autoFocus = false, onOpenLogin, stats }) {
  const [session, setSession] = useState(() => backend.auth.getSession());
  useEffect(() => backend.auth.onChange(setSession), []);

  const rootRef = useRef(null);
  useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => {
      rootRef.current?.scrollIntoView({ block: "start" });
    }, 60);
    return () => clearTimeout(t);
  }, [autoFocus]);

  const [msg, setMsg] = useState(null); // { ok, text }

  const cloudOff = backend.mode === "local";
  const email = session?.user?.email || "";

  return (
    <section className="profile-section" ref={rootRef}>
      <div className="profile-head">
        <div className="profile-head-top">
          <span className="profile-avatar">
            {session ? email[0]?.toUpperCase() : "?"}
          </span>
          <div className="profile-head-id">
            {session ? (
              <>
                <strong className="profile-head-name">{email}</strong>
                <span className="u-mono profile-head-sub">
                  ● 已登录 · 标注自动同步
                </span>
              </>
            ) : (
              <>
                <strong className="profile-head-name">未登录</strong>
                <span className="u-mono profile-head-sub">
                  {cloudOff
                    ? "云端未配置 · 数据仅存本机"
                    : "数据仅存本机 · 登录后跨设备同步"}
                </span>
              </>
            )}
          </div>
          {!cloudOff &&
            (session ? (
              <button
                type="button"
                className="profile-head-btn"
                onClick={async () => {
                  await backend.auth.signOut();
                  setMsg({ ok: true, text: "已退出 · 本机数据保留" });
                }}
              >
                退出
              </button>
            ) : (
              <button
                type="button"
                className="profile-head-btn primary"
                onClick={onOpenLogin}
              >
                ◎ 登录
              </button>
            ))}
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <strong>{stats.wanted}</strong>
            <span className="u-mono">想看</span>
          </div>
          <div className="profile-stat">
            <strong>{stats.planned}</strong>
            <span className="u-mono">待看</span>
          </div>
          <div className="profile-stat">
            <strong>{stats.seen}</strong>
            <span className="u-mono">看过</span>
          </div>
        </div>
        <p className="u-mono profile-head-total">
          共标记 {stats.totalMarks} 场演出
        </p>

        {msg && (
          <p
            className="api-key-hint u-mono"
            style={{ color: msg.ok ? "var(--olive, #5e6a4e)" : "var(--bauhaus-red)" }}
          >
            {msg.text}
          </p>
        )}
      </div>
    </section>
  );
}
