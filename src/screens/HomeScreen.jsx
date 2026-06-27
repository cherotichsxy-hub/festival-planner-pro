import React, { useMemo, useState } from "react";

export default function HomeScreen({
  festivals,
  performances,
  selections,
  onOpenFestival,
  onOpenUpload,
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const enriched = useMemo(() => {
    return festivals
      .map((f) => {
        const perfs = performances.filter((p) => p.festivalId === f.id);
        const marked = perfs.filter((p) => selections[f.id]?.[p.id]).length;
        return {
          ...f,
          stagesCount: f.stages?.length || 0,
          daysCount: f.dates?.length || 0,
          setsCount: perfs.length,
          markedCount: marked,
        };
      })
      .filter((f) =>
        q
          ? f.name.toLowerCase().includes(q) ||
            (f.location || "").toLowerCase().includes(q) ||
            String(f.year || "").includes(q)
          : true,
      )
      .sort((a, b) => {
        // 有标记的优先；同等时按 year 倒序
        if (a.markedCount !== b.markedCount) return b.markedCount - a.markedCount;
        return (b.year || 0) - (a.year || 0);
      });
  }, [festivals, performances, selections, q]);

  return (
    <>
      <header className="home-header">
        <div className="home-brand">
          <span className="home-brand-mark">FP</span>
          <h1 className="home-title">
            FESTIVAL<br />PLANNER<span className="home-title-dot">.</span>
          </h1>
        </div>
        <p className="home-sub">把海报里的演出 · 变成可复用的日程</p>
      </header>

      <div className="home-search">
        <span className="u-mono">FIND</span>
        <input
          type="search"
          placeholder="搜音乐节 / 城市 / 年份"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <section className="home-rack">
        <header className="rack-title">
          <span className="u-mono">CHANNELS / 频道</span>
          <span className="u-mono rack-count">
            {String(enriched.length).padStart(2, "0")}
          </span>
        </header>
        {enriched.length === 0 ? (
          <p className="home-empty u-mono">— 没找到匹配的音乐节 —</p>
        ) : (
          <ul className="channel-list">
            {enriched.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  className="channel-card"
                  onClick={() => onOpenFestival(f.id)}
                >
                  <span className="u-mono channel-tag">
                    FREQ · <em>{f.year}</em>
                  </span>
                  <strong className="channel-name">{f.name}</strong>
                  <span className="u-mono channel-loc">{f.location}</span>
                  <span className="u-mono channel-stats">
                    <em>{f.daysCount}</em>D ·{" "}
                    <em>{f.stagesCount}</em>STAGES ·{" "}
                    <em>{f.setsCount}</em> SETS
                    {f.markedCount > 0 && (
                      <>
                        {" "}· <em className="channel-marked">●</em>{" "}
                        <em>{f.markedCount}</em> MARKED
                      </>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <button className="home-add-btn" type="button" onClick={onOpenUpload}>
          <span className="home-add-cross">＋</span>
          <span className="home-add-text">
            <strong>添加新音乐节</strong>
            <small className="u-mono">UPLOAD · POSTER → SCHEDULE</small>
          </span>
          <span className="home-add-arrow">→</span>
        </button>
      </section>
    </>
  );
}
