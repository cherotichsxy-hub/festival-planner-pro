import React from "react";
import { createPortal } from "react-dom";
import { useI18n } from "../lib/i18n.js";
import BrandMark from "./BrandMark.jsx";

// 联系 / 关于作者：底部滑出 sheet。作者标识 + 邮箱 / 小红书 / GitHub 链接。
const LINKS = [
  { key: "email", icon: "✉", href: "mailto:cherotichsxy@gmail.com", value: "cherotichsxy@gmail.com" },
  { key: "xhs", icon: "◍", href: "https://xhslink.com/m/82fOD3WgpEE", value: "@小红书" },
];

export default function ContactSheet({ onClose }) {
  const { t } = useI18n();
  return createPortal(
    <div className="sheet-overlay" onClick={onClose} role="dialog" aria-label={t("contact.title")}>
      <div className="sheet-card contact-card" onClick={(e) => e.stopPropagation()}>
        <header className="sheet-head">
          <strong>{t("contact.title")}</strong>
          <button type="button" className="sheet-close" onClick={onClose} aria-label={t("login.close")}>✕</button>
        </header>

        <div className="contact-brand">
          <BrandMark className="contact-brand-mark" />
          <div>
            <div className="contact-brand-name">Encore<span className="brand-title-dot">.</span></div>
            <p className="contact-intro">{t("contact.intro")}</p>
          </div>
        </div>

        <ul className="contact-links">
          {LINKS.map((l) => (
            <li key={l.key}>
              <a
                className="contact-link"
                href={l.href}
                target={l.key === "email" ? undefined : "_blank"}
                rel="noopener noreferrer"
              >
                <span className="contact-link-icon" aria-hidden>{l.icon}</span>
                <span className="contact-link-label">{t(`contact.${l.key}`)}</span>
                <span className="contact-link-value u-mono">{l.value}</span>
                <span className="contact-link-arrow" aria-hidden>↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
