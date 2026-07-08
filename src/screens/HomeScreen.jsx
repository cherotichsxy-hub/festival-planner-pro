import React, { useMemo, useState } from "react";
import { useI18n } from "../lib/i18n.js";
import ContactSheet from "../components/ContactSheet.jsx";

// 磁带条配色（按 festival 顺序循环分配），dusty 复古调
const CASSETTE_COLORS = [
  { color: "#8b1d1d", ink: "#fbf9f8" }, // crimson
  { color: "#7e97a8", ink: "#fbf9f8" }, // dusty blue
  { color: "#ecc12a", ink: "#1e1506" }, // mustard
  { color: "#5e6a4e", ink: "#fbf9f8" }, // olive
  { color: "#9b5933", ink: "#fbf9f8" }, // rust
  { color: "#6a2a2a", ink: "#fbf9f8" }, // wine
  { color: "#a08542", ink: "#fbf9f8" }, // mustard-dark
  { color: "#6a7a8a", ink: "#fbf9f8" }, // slate
];

export default function HomeScreen({
  festivals,
  performances,
  selections,
  wanted = {},
  attended = {},
  session,
  onOpenAccount,
  onToggleWanted,
  onToggleAttended,
  onOpenFestival,
  onOpenUpload,
}) {
  const { t, lang, setLang } = useI18n();
  const [query, setQuery] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const q = query.trim().toLowerCase();

  const enriched = useMemo(() => {
    return festivals
      .map((f, i) => {
        const perfs = performances.filter((p) => p.festivalId === f.id);
        const marked = perfs.filter((p) => selections[f.id]?.[p.id]).length;
        return {
          ...f,
          _perfs: perfs,
          stagesCount: f.stages?.length || 0,
          daysCount: f.dates?.length || 0,
          setsCount: perfs.length,
          markedCount: marked,
          cassetteIdx: i,
        };
      })
      .filter((f) =>
        q
          ? f.name.toLowerCase().includes(q) ||
            (f.location || "").toLowerCase().includes(q) ||
            String(f.year || "").includes(q) ||
            f._perfs.some((p) => p.artistName.toLowerCase().includes(q))
          : true,
      )
      .sort((a, b) => {
        if (a.markedCount !== b.markedCount) return b.markedCount - a.markedCount;
        return (b.year || 0) - (a.year || 0);
      });
  }, [festivals, performances, selections, q]);

  return (
    <div className="screen-body">
      {/* 右上角常驻：语言切换 + 登录入口 + 联系 */}
      <div className="top-chips">
        <button
          type="button"
          className="lang-chip"
          onClick={() => setLang(lang === "zh" ? "en" : "zh")}
          aria-label="switch language"
        >
          {lang === "zh" ? "EN" : "中"}
        </button>
        {onOpenAccount && (
          <button
            type="button"
            className={`login-chip${session ? " on" : ""}`}
            onClick={onOpenAccount}
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
        )}
        <button
          type="button"
          className="contact-chip"
          onClick={() => setContactOpen(true)}
          aria-label={t("contact.title")}
        >
          ✉
        </button>
      </div>
      <header className="brand-bar">
        <div className="brand-bar-marker">
          <span className="brand-mark">FP</span>
        </div>
        <h1 className="brand-title">
          FESTIVAL<br />
          PLANNER<span className="brand-title-dot">.</span>
        </h1>
        <p className="brand-tagline">{t("home.tagline")}</p>
      </header>

      {contactOpen && <ContactSheet onClose={() => setContactOpen(false)} />}

      <div className="search-bar">
        <span className="u-mono search-label">FIND</span>
        <input
          type="search"
          placeholder={t("home.search")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="home-body">
        <button
          type="button"
          className="upload-rack-btn"
          onClick={onOpenUpload}
        >
          <span className="upload-rack-mark">＋</span>
          <div className="upload-rack-text">
            <strong>{t("home.addNew")}</strong>
            <span className="u-mono">UPLOAD · POSTER → SCHEDULE</span>
          </div>
          <span className="upload-rack-arrow">→</span>
        </button>

        <header className="rack-title">
          <span className="u-mono">CHANNELS{lang === "zh" ? " / 频道" : ""}</span>
          <span className="u-mono rack-count">
            {String(enriched.length).padStart(2, "0")}
          </span>
        </header>

        {enriched.length === 0 ? (
          <p className="rack-empty u-mono">{t("home.noMatch")}</p>
        ) : (
          <ul className="cassette-stack">
            {enriched.map((f) => {
              const cassette =
                CASSETTE_COLORS[f.cassetteIdx % CASSETTE_COLORS.length];
              const isWanted = !!wanted[f.id];
              const isAttended = !!attended[f.id];
              return (
                <li key={f.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    className="cassette-card"
                    style={{
                      "--cassette-color": cassette.color,
                      "--cassette-ink": cassette.ink,
                    }}
                    onClick={() => onOpenFestival(f.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onOpenFestival(f.id);
                    }}
                  >
                    <div className="cassette-strip">
                      <span className="cassette-strip-label">
                        FREQ · {f.year}
                      </span>
                      <span className="cassette-strip-actions">
                        <button
                          type="button"
                          className={`cassette-chip${isWanted ? " on" : ""}`}
                          aria-pressed={isWanted}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWanted?.(f.id);
                          }}
                        >
                          {isWanted ? t("home.wantOn") : t("home.want")}
                        </button>
                        <button
                          type="button"
                          className={`cassette-chip${isAttended ? " on" : ""}`}
                          aria-pressed={isAttended}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleAttended?.(f.id);
                          }}
                        >
                          {isAttended ? t("home.beenOn") : t("home.been")}
                        </button>
                      </span>
                    </div>
                    <div className="cassette-label">
                      <strong className="cassette-name">{f.name}</strong>
                      <span className="cassette-loc">{f.location}</span>
                      <div className="cassette-stats">
                        <span>
                          {f.daysCount}D · {f.stagesCount} STAGES ·{" "}
                          {f.setsCount} SETS
                        </span>
                        {f.markedCount > 0 && (
                          <span className="cassette-marks">
                            ● {f.markedCount} MARKED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
