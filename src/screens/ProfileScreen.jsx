import React, { useEffect, useState } from "react";

export default function ProfileScreen({
  festivals,
  selections,
  onOpenFestival,
}) {
  const myFestivals = festivals.filter(
    (f) => (selections[f.id] && Object.keys(selections[f.id]).length) || false,
  );

  // DeepSeek API key 设置
  const [apiKey, setApiKey] = useState("");
  const [reveal, setReveal] = useState(false);
  const [savedAt, setSavedAt] = useState(0);
  useEffect(() => {
    try {
      setApiKey(localStorage.getItem("me:deepseek_api_key") || "");
    } catch {}
  }, []);
  function saveKey() {
    try {
      const trimmed = apiKey.trim();
      if (trimmed) localStorage.setItem("me:deepseek_api_key", trimmed);
      else localStorage.removeItem("me:deepseek_api_key");
      setSavedAt(Date.now());
    } catch {}
  }
  const hasKey = apiKey.trim().length > 0;

  return (
    <div className="screen-body">
      <header className="brand-bar">
        <div className="brand-bar-marker">
          <span className="brand-mark">ME</span>
          <span className="u-mono brand-bar-sys">PROFILE · SETTINGS</span>
        </div>
        <h1 className="brand-title">
          MY<br />PLANNER<span className="brand-title-dot">.</span>
        </h1>
        <p className="brand-tagline">已收藏的音乐节 · API key · 设置</p>
      </header>

      <div className="home-body">
        <section className="profile-section">
          <header className="rack-title">
            <span className="u-mono">MY FESTIVALS</span>
            <span className="u-mono rack-count">
              {String(myFestivals.length).padStart(2, "0")}
            </span>
          </header>
          {myFestivals.length === 0 ? (
            <p className="rack-empty u-mono">
              — 还没标过任何演出 · 去首页选一个音乐节 —
            </p>
          ) : (
            <ul className="my-fest-list">
              {myFestivals.map((f) => {
                const count = Object.keys(selections[f.id] || {}).length;
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      className="my-fest-card"
                      onClick={() => onOpenFestival(f.id)}
                    >
                      <strong className="my-fest-name">{f.name}</strong>
                      <span className="u-mono my-fest-loc">{f.location}</span>
                      <span className="u-mono my-fest-stat">
                        ● {count} SETS MARKED
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
            <span className="u-mono">DEEPSEEK API KEY</span>
            <span className="u-mono rack-count">{hasKey ? "ON" : "OFF"}</span>
          </header>

          <div className={`api-key-card${hasKey ? " active" : ""}`}>
            <div className="api-key-head">
              <span className="dot" />
              <span>
                上传海报识别需要 · 存在本地 localStorage · 不会上传任何地方
              </span>
            </div>
            <div className="api-key-row">
              <input
                type={reveal ? "text" : "password"}
                placeholder="sk-xxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                type="button"
                className="api-key-toggle"
                onClick={() => setReveal((v) => !v)}
              >
                {reveal ? "隐" : "显"}
              </button>
              <button
                type="button"
                className="api-key-save"
                onClick={saveKey}
              >
                保存
              </button>
            </div>
            {savedAt > 0 && (
              <p className="api-key-hint u-mono">已保存 · {hasKey ? "可以去上传图片识别了" : "已清空 key"}</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
