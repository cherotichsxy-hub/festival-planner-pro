import React, { useMemo, useState } from "react";
import { useI18n } from "../lib/i18n.js";
import ContactSheet from "../components/ContactSheet.jsx";
import BrandMark from "../components/BrandMark.jsx";

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

// 音乐节的时间锚点：取最早的一天（YYYY-MM-DD，可直接字典序比较=时间序）；
// 无日期回退到年份；全无日期返回空串，排序时沉到最底。
function festivalStart(f) {
  const ds = (f.dates || []).filter(Boolean).slice().sort();
  if (ds.length) return ds[0];
  if (f.year) return `${f.year}-01-01`;
  return "";
}

function festivalEnd(f) {
  const ds = (f.dates || []).filter(Boolean).slice().sort();
  if (ds.length) return ds[ds.length - 1];
  if (f.year) return `${f.year}-12-31`;
  return "";
}

function localIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

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
      // 按时间倒序：日期越晚（越新/越靠近未来）越靠上，越早的沉到底部。
      // 名称做稳定并列兜底。
      .sort((a, b) => {
        const t = festivalStart(b).localeCompare(festivalStart(a));
        if (t !== 0) return t;
        return (a.name || "").localeCompare(b.name || "");
      });
  }, [festivals, performances, selections, q]);

  const { upcoming, channels } = useMemo(() => {
    const today = localIsoDate(new Date());
    const upcomingItems = enriched
      .filter((festival) => wanted[festival.id] && festivalEnd(festival) >= today)
      .sort((a, b) => {
        const dateOrder = festivalStart(a).localeCompare(festivalStart(b));
        return dateOrder || (a.name || "").localeCompare(b.name || "");
      });
    const upcomingIds = new Set(upcomingItems.map((festival) => festival.id));
    return {
      upcoming: upcomingItems,
      channels: enriched.filter((festival) => !upcomingIds.has(festival.id)),
    };
  }, [enriched, wanted]);

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
          <BrandMark />
        </div>
        <h1 className="brand-title">
          ENCORE<span className="brand-title-dot">.</span>
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

        {enriched.length === 0 ? (
          <p className="rack-empty u-mono">{t("home.noMatch")}</p>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section className="home-rack-section is-upcoming">
                <header className="rack-title">
                  <span className="u-mono">UPCOMING{lang === "zh" ? " / 即将开始" : ""}</span>
                  <span className="u-mono rack-count">
                    {String(upcoming.length).padStart(2, "0")}
                  </span>
                </header>
                <CassetteStack
                  festivals={upcoming}
                  wanted={wanted}
                  attended={attended}
                  onToggleWanted={onToggleWanted}
                  onToggleAttended={onToggleAttended}
                  onOpenFestival={onOpenFestival}
                />
              </section>
            )}

            <section className="home-rack-section">
              <header className="rack-title">
                <span className="u-mono">CHANNELS{lang === "zh" ? " / 频道" : ""}</span>
                <span className="u-mono rack-count">
                  {String(channels.length).padStart(2, "0")}
                </span>
              </header>
              {channels.length > 0 && (
                <CassetteStack
                  festivals={channels}
                  wanted={wanted}
                  attended={attended}
                  onToggleWanted={onToggleWanted}
                  onToggleAttended={onToggleAttended}
                  onOpenFestival={onOpenFestival}
                />
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function CassetteStack({
  festivals,
  wanted,
  attended,
  onToggleWanted,
  onToggleAttended,
  onOpenFestival,
}) {
  const { t } = useI18n();
  return (
    <ul className="cassette-stack">
      {festivals.map((festival) => {
        const cassette =
          CASSETTE_COLORS[festival.cassetteIdx % CASSETTE_COLORS.length];
        const isWanted = !!wanted[festival.id];
        const isAttended = !!attended[festival.id];
        return (
          <li key={festival.id}>
            <div
              role="button"
              tabIndex={0}
              className="cassette-card"
              style={{
                "--cassette-color": cassette.color,
                "--cassette-ink": cassette.ink,
              }}
              onClick={() => onOpenFestival(festival.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onOpenFestival(festival.id);
              }}
            >
              <div className="cassette-strip">
                <span className="cassette-strip-label">FREQ · {festival.year}</span>
                <span className="cassette-strip-actions">
                  <button
                    type="button"
                    className={`cassette-chip${isWanted ? " on" : ""}`}
                    aria-pressed={isWanted}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWanted?.(festival.id);
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
                      onToggleAttended?.(festival.id);
                    }}
                  >
                    {isAttended ? t("home.beenOn") : t("home.been")}
                  </button>
                </span>
              </div>
              <div className="cassette-label">
                <strong className="cassette-name">{festival.name}</strong>
                <span className="cassette-loc">{festival.location}</span>
                <div className="cassette-stats">
                  <span>
                    {festival.daysCount}D · {festival.stagesCount} STAGES ·{" "}
                    {festival.setsCount} SETS
                  </span>
                  {festival.markedCount > 0 && (
                    <span className="cassette-marks">
                      ● {festival.markedCount} MARKED
                    </span>
                  )}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
