import React from "react";

// 分享图角落水印："安可时刻"单色小徽 + ENCORE. 字标（同 brand/encore-mark-mono.svg）。
// 只用内联样式：分享画布离屏渲染给 html2canvas 抓图，不依赖全局 class。
export default function ShareWatermark({ style }) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        color: "var(--paper-ink)",
        fontFamily: "var(--font-mono)",
        ...style,
      }}
    >
      <svg viewBox="40 70 404 344" width="18" height="15.3" style={{ display: "block" }}>
        <path d="M127.8 252.7 A126 126 0 0 1 356.2 252.7" fill="none" stroke="currentColor" strokeWidth="26" />
        <path d="M101.2 218 A166 166 0 0 1 382.8 218" fill="none" stroke="currentColor" strokeWidth="26" />
        <path d="M81.9 176.4 A206 206 0 0 1 402.1 176.4" fill="none" stroke="currentColor" strokeWidth="26" />
        <path d="M152 306 A90 90 0 0 1 332 306 Z" fill="currentColor" />
        <line x1="70" y1="306" x2="414" y2="306" stroke="currentColor" strokeWidth="24" />
        <circle cx="82" cy="360" r="30" fill="currentColor" />
        <circle cx="162" cy="360" r="30" fill="currentColor" />
        <circle cx="242" cy="360" r="30" fill="currentColor" />
        <circle cx="322" cy="360" r="30" fill="currentColor" />
        <circle cx="402" cy="360" r="30" fill="currentColor" />
      </svg>
      <span style={{ fontWeight: 700, fontSize: "11px", letterSpacing: "0.08em" }}>
        ENCORE<span style={{ color: "var(--bauhaus-red)" }}>.</span>
      </span>
    </span>
  );
}
