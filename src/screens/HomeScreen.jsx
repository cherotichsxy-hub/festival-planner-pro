import React, { useMemo, useState } from "react";

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
  const [query, setQuery] = useState("");
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
      {/* 登录入口：挂在手机壳层级，滚动时也固定在右上角 */}
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
              已同步
            </>
          ) : (
            <>◎ 登录</>
          )}
        </button>
      )}
      <header className="brand-bar">
        <div className="brand-bar-marker">
          <span className="brand-mark">FP</span>
          <span className="u-mono brand-bar-sys">
            FESTIVAL · PLANNER · PRO
          </span>
        </div>
        <h1 className="brand-title">
          FESTIVAL<br />
          PLANNER<span className="brand-title-dot">.</span>
        </h1>
        <p className="brand-tagline">不错过每一个想看的现场</p>
      </header>

      <div className="search-bar">
        <span className="u-mono search-label">FIND</span>
        <input
          type="search"
          placeholder="搜演出"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="home-body">
        <header className="rack-title">
          <span className="u-mono">CHANNELS / 频道</span>
          <span className="u-mono rack-count">
            {String(enriched.length).padStart(2, "0")}
          </span>
        </header>

        {enriched.length === 0 ? (
          <p className="rack-empty u-mono">— 没找到匹配的音乐节 —</p>
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
                          {isWanted ? "★ 想看" : "想看"}
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
                          {isAttended ? "✓ 去过" : "去过"}
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

        <button
          type="button"
          className="upload-rack-btn"
          onClick={onOpenUpload}
        >
          <span className="upload-rack-mark">＋</span>
          <div className="upload-rack-text">
            <strong>添加新音乐节</strong>
            <span className="u-mono">UPLOAD · POSTER → SCHEDULE</span>
          </div>
          <span className="upload-rack-arrow">→</span>
        </button>
      </div>
    </div>
  );
}
