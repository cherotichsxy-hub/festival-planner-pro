import React from "react";

// 品牌图形"安可时刻"反白小徽（墨底纸线）：舞台光 + 声浪弧 + 人群点。
// 完整版资产见 brand/encore-mark.svg。
export default function BrandMark({ className = "" }) {
  return (
    <span className={`brand-mark ${className}`.trim()} aria-hidden="true">
      <svg viewBox="24 24 436 436" width="100%" height="100%">
        <path d="M127.8 252.7 A126 126 0 0 1 356.2 252.7" fill="none" stroke="var(--bg-phone)" strokeWidth="16" />
        <path d="M101.2 218 A166 166 0 0 1 382.8 218" fill="none" stroke="var(--bg-phone)" strokeWidth="16" />
        <path d="M81.9 176.4 A206 206 0 0 1 402.1 176.4" fill="none" stroke="var(--bg-phone)" strokeWidth="16" />
        <path d="M152 306 A90 90 0 0 1 332 306 Z" fill="var(--bauhaus-yellow)" />
        <line x1="70" y1="306" x2="414" y2="306" stroke="var(--bg-phone)" strokeWidth="14" />
        <circle cx="82" cy="360" r="26" fill="var(--bg-phone)" />
        <circle cx="162" cy="360" r="26" fill="var(--bg-phone)" />
        <circle cx="242" cy="360" r="26" fill="var(--bg-phone)" />
        <circle cx="322" cy="360" r="26" fill="var(--bg-phone)" />
        <circle cx="402" cy="360" r="26" fill="var(--bg-phone)" />
      </svg>
    </span>
  );
}
