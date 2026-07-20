import React, { useEffect, useRef, useState } from "react";
import { backend } from "../lib/backend.js";
import { useI18n } from "../lib/i18n.js";

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
  const { t } = useI18n();
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
    <div className="screen-body profile-screen">
      <header className="brand-bar">
        <div className="brand-bar-marker">
          <span className="brand-mark">ME</span>
          <span className="u-mono brand-bar-sys">PROFILE · ARCHIVE</span>
        </div>
        <h1 className="brand-title">
          MY<br />PLANNER<span className="brand-title-dot">.</span>
        </h1>
        <p className="brand-tagline">{t("profile.sub")}</p>
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
            <span className="u-mono">{t("profile.want")}</span>
            <span className="u-mono rack-count">
              {String(wantedFestivals.length).padStart(2, "0")}
            </span>
          </header>
          {wantedFestivals.length === 0 ? (
            <p className="rack-empty u-mono">
              {t("profile.wantEmpty")}
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
            <span className="u-mono">{t("profile.planned")}</span>
            <span className="u-mono rack-count">
              {String(plannedFestivals.length).padStart(2, "0")}
            </span>
          </header>
          {plannedFestivals.length === 0 ? (
            <p className="rack-empty u-mono">
              {t("profile.plannedEmpty")}
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
            <span className="u-mono">{t("profile.attended")}</span>
            <span className="u-mono rack-count">
              {String(seenFestivals.length).padStart(2, "0")}
            </span>
          </header>
          {seenFestivals.length === 0 ? (
            <p className="rack-empty u-mono">
              {t("profile.attendedEmpty")}
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
                          ● {t("profile.artistsSeen", { n: artists.length })}
                        </span>
                        <div className="attended-artists">
                          {artists.map((a) => (
                            <span key={a} className="attended-artist">{a}</span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <span className="u-mono attended-sub">
                        {t("profile.noMustSeen")}
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
  const { t } = useI18n();
  const [session, setSession] = useState(() => backend.auth.getSession());
  useEffect(() => backend.auth.onChange(setSession), []);

  const rootRef = useRef(null);
  useEffect(() => {
    if (!autoFocus) return;
    const timer = setTimeout(() => {
      rootRef.current?.scrollIntoView({ block: "start" });
    }, 60);
    return () => clearTimeout(timer);
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
                  {t("profile.loginSynced")}
                </span>
              </>
            ) : (
              <>
                <strong className="profile-head-name">{t("profile.notLoggedIn")}</strong>
                <span className="u-mono profile-head-sub">
                  {cloudOff ? t("profile.cloudOff") : t("profile.localOnly")}
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
                  setMsg({ ok: true, text: t("profile.signedOut") });
                }}
              >
                {t("profile.signOut")}
              </button>
            ) : (
              <button
                type="button"
                className="profile-head-btn primary"
                onClick={onOpenLogin}
              >
                ◎ {t("home.login")}
              </button>
            ))}
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <strong>{stats.wanted}</strong>
            <span className="u-mono">{t("profile.statWant")}</span>
          </div>
          <div className="profile-stat">
            <strong>{stats.planned}</strong>
            <span className="u-mono">{t("profile.statPlan")}</span>
          </div>
          <div className="profile-stat">
            <strong>{stats.seen}</strong>
            <span className="u-mono">{t("profile.statSeen")}</span>
          </div>
        </div>
        <p className="u-mono profile-head-total">
          {t("profile.totalMarks", { n: stats.totalMarks })}
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
