import React from "react";

export default function ProfileScreen({
  festivals,
  selections,
  onOpenFestival,
}) {
  const myFestivals = festivals.filter(
    (f) => (selections[f.id] && Object.keys(selections[f.id]).length) || false,
  );

  return (
    <>
      <header className="profile-header">
        <h1 className="profile-title">
          MY<br />PLANNER<span className="home-title-dot">.</span>
        </h1>
        <p className="profile-sub u-mono">已收藏的音乐节 + 设置</p>
      </header>

      <section className="profile-section">
        <header className="rack-title">
          <span className="u-mono">MY FESTIVALS</span>
          <span className="u-mono rack-count">
            {String(myFestivals.length).padStart(2, "0")}
          </span>
        </header>
        {myFestivals.length === 0 ? (
          <p className="profile-empty u-mono">
            — 还没标过任何演出 · 去首页选一个音乐节 —
          </p>
        ) : (
          <ul className="channel-list">
            {myFestivals.map((f) => {
              const count = Object.keys(selections[f.id] || {}).length;
              return (
                <li key={f.id}>
                  <button
                    type="button"
                    className="channel-card"
                    onClick={() => onOpenFestival(f.id)}
                  >
                    <strong className="channel-name">{f.name}</strong>
                    <span className="u-mono channel-loc">{f.location}</span>
                    <span className="u-mono channel-stats">
                      <em>{count}</em> SETS MARKED
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="profile-section">
        <header className="rack-title">
          <span className="u-mono">SETTINGS</span>
        </header>
        <p className="profile-stub u-mono">
          — DeepSeek API key 设置即将上线 · 暂时无需填 —
        </p>
      </section>
    </>
  );
}
