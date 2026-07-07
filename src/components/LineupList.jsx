import React, { useEffect, useMemo, useRef, useState } from "react";
import { formatHM, formatMonthDay } from "../lib/time.js";
import { getStageColor } from "../lib/stages.js";

export default function LineupList({
  festival,
  performances,
  activeDate,
  stageFilter,
  selections,
  conflictMap,
  onSetStatus,
  initialQuery = "",
  isToday = false,
  onSearchingChange,
}) {
  const [query, setQuery] = useState(initialQuery);
  const trimmedQ = query.trim().toLowerCase();
  const searching = trimmedQ.length > 0;

  // 告诉父级"正在搜索"——搜索是跨天的，日期胶囊要变灰，别假装还在起作用
  useEffect(() => {
    onSearchingChange?.(searching);
    return () => onSearchingChange?.(false);
  }, [searching]); // eslint-disable-line

  // 现场模式的"现在"，进页面时取一次
  const now = useMemo(() => new Date(), []);

  const visible = useMemo(() => {
    let pool = performances;
    if (!searching) {
      pool = pool.filter((p) => p.displayDate === activeDate);
    }
    return pool
      .filter((p) => stageFilter === "all" || p.stageName === stageFilter)
      .filter((p) =>
        searching
          ? p.artistName.toLowerCase().includes(trimmedQ) ||
            p.stageName.toLowerCase().includes(trimmedQ)
          : true,
      )
      .sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
  }, [performances, activeDate, stageFilter, searching, trimmedQ]);

  // 冲突提示规则（和 MY PLAN 一致）：
  // 必看只在撞必看时报警；待定撞任何已标记的都提示（备选本来就允许重叠，但值得知道）
  function relevantConflicts(p) {
    const list = conflictMap[p.id] || [];
    if (selections[p.id] === "must") {
      return list.filter((c) => selections[c.id] === "must");
    }
    return list;
  }

  const groups = useMemo(() => {
    // 搜索时不分组，直接一个平铺列表
    if (searching) return null;
    const map = new Map();
    for (const p of visible) {
      const d = new Date(p.startAt);
      const key = `${String(d.getHours()).padStart(2, "0")}:00`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    }
    return Array.from(map.entries());
  }, [visible, searching]);

  // 现场模式：找到"现在"所在的组（第一个还没整组演完的），进页面自动滚过去
  const nowGroupIndex = useMemo(() => {
    if (!isToday || !groups) return -1;
    return groups.findIndex(([, items]) =>
      items.some((p) => new Date(p.endAt) > now),
    );
  }, [isToday, groups, now]);

  const nowGroupRef = useRef(null);
  useEffect(() => {
    if (nowGroupIndex > 0 && nowGroupRef.current) {
      const t = setTimeout(() => {
        nowGroupRef.current?.scrollIntoView({ block: "start" });
      }, 80);
      return () => clearTimeout(t);
    }
  }, []); // eslint-disable-line — 只在进页面时滚一次

  return (
    <div className={`lineup-list${searching ? " is-searching" : ""}`}>
      <div className="lineup-search">
        <span className="lineup-search-icon" aria-hidden>⌕</span>
        <input
          type="search"
          enterKeyHint="search"
          className="lineup-search-input"
          placeholder="搜艺人 / 演出"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="搜索演出"
        />
        {query && (
          <button
            type="button"
            className="lineup-search-clear"
            onClick={() => setQuery("")}
            aria-label="清空搜索"
          >
            ✕
          </button>
        )}
      </div>

      {searching && (
        <div className="lineup-search-meta u-mono">
          {visible.length > 0
            ? `跨 ${festival.dates.length} 天找到 ${visible.length} 条`
            : "没有结果"}
        </div>
      )}

      {!searching && (
        <div className="lineup-legend">
          <span><strong>★</strong> 必看</span>
          <span><strong>?</strong> 待定</span>
        </div>
      )}

      {visible.length === 0 && !searching && (
        <div className="lineup-empty">
          <p className="u-mono">— NO SETS · 该筛选下无演出 —</p>
        </div>
      )}

      {searching ? (
        <ul className="lineup-cards lineup-cards-flat">
          {visible.map((p) => (
            <LineupCard
              key={p.id}
              perf={p}
              festival={festival}
              status={selections[p.id]}
              conflicts={relevantConflicts(p)}
              onSetStatus={onSetStatus}
              now={isToday ? now : null}
              showDate
            />
          ))}
        </ul>
      ) : (
        groups &&
        groups.map(([hour, items], gi) => (
          <section
            key={hour}
            className="lineup-group"
            ref={gi === nowGroupIndex ? nowGroupRef : undefined}
          >
            <div className="lineup-hour">
              <strong className="lineup-hour-time">{hour}</strong>
              {gi === nowGroupIndex && (
                <span className="lineup-hour-now u-mono">● NOW</span>
              )}
              <span className="lineup-hour-line" />
              <span className="u-mono lineup-hour-count">
                {String(items.length).padStart(2, "0")} SETS
              </span>
            </div>
            <ul className="lineup-cards">
              {items.map((p) => (
                <LineupCard
                  key={p.id}
                  perf={p}
                  festival={festival}
                  status={selections[p.id]}
                  conflicts={relevantConflicts(p)}
                  onSetStatus={onSetStatus}
                  now={isToday ? now : null}
                />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

function LineupCard({ perf, festival, status, conflicts, onSetStatus, now, showDate }) {
  const color = getStageColor(festival, perf.stageName);
  const hasConflict = conflicts.length > 0;
  // 点冲突标签展开：撞了谁、几点、哪个台
  const [showConflicts, setShowConflicts] = useState(false);

  // 现场模式：演完的压暗，正在演的标 LIVE
  const isPast = now ? new Date(perf.endAt) < now : false;
  const isLive = now
    ? new Date(perf.startAt) <= now && now <= new Date(perf.endAt)
    : false;

  const bodyInner = (
    <>
      <strong className="lineup-card-name">
        {perf.artistName}
        {perf.link && <span className="lineup-card-link-mark" aria-hidden>↗</span>}
      </strong>
      <div className="lineup-card-meta u-mono">
        <span className="lineup-card-stage">
          <span className="dot" />{perf.stageName}
        </span>
        {isLive && <span className="lineup-card-livetag">LIVE</span>}
        {hasConflict && (
          <button
            type="button"
            className="lineup-card-conflict"
            onClick={(e) => {
              e.preventDefault();
              setShowConflicts((v) => !v);
            }}
            aria-expanded={showConflicts}
          >
            ⚠ 撞 {conflicts.length} 场 {showConflicts ? "−" : "+"}
          </button>
        )}
      </div>
    </>
  );
  return (
    <li
      className={`lineup-card status-${status || "none"}${hasConflict ? " has-conflict" : ""}${isPast ? " is-past" : ""}${isLive ? " is-live" : ""}`}
      style={{
        "--stage-solid": color.solid,
        "--stage-soft": color.soft,
        "--stage-text": color.text,
      }}
    >
      <div className="lineup-card-marker">
        {showDate && (
          <span className="lineup-card-date u-mono">{formatMonthDay(perf.displayDate)}</span>
        )}
        <span className="lineup-card-start">{formatHM(perf.startAt)}</span>
        <span className="lineup-card-end u-mono">→ {formatHM(perf.endAt)}</span>
      </div>
      {perf.link ? (
        <a
          className="lineup-card-body lineup-card-body-link"
          href={perf.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {bodyInner}
        </a>
      ) : (
        <div className="lineup-card-body">{bodyInner}</div>
      )}
      <div className="lineup-card-actions">
        <button
          type="button"
          className={`act act-must${status === "must" ? " on" : ""}`}
          onClick={() => onSetStatus(perf.id, status === "must" ? null : "must")}
          aria-label={status === "must" ? "取消必看" : "标为必看"}
          aria-pressed={status === "must"}
        >
          ★
        </button>
        <button
          type="button"
          className={`act act-maybe${status === "maybe" ? " on" : ""}`}
          onClick={() => onSetStatus(perf.id, status === "maybe" ? null : "maybe")}
          aria-label={status === "maybe" ? "取消待定" : "标为待定"}
          aria-pressed={status === "maybe"}
        >
          ?
        </button>
      </div>

      {/* 展开后的冲突明细：撞了谁 + 一键把本场降为待定 */}
      {hasConflict && showConflicts && (
        <ul className="conflict-detail u-mono">
          {conflicts.map((c) => (
            <li key={c.id}>
              {formatHM(c.startAt)}–{formatHM(c.endAt)} · {c.artistName} · {c.stageName}
            </li>
          ))}
          {status === "must" && (
            <li>
              <button
                type="button"
                className="conflict-demote"
                onClick={() => onSetStatus(perf.id, "maybe")}
              >
                把本场改为 ? 待定
              </button>
            </li>
          )}
        </ul>
      )}
    </li>
  );
}
