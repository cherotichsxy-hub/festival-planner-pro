import React, { useEffect, useState } from "react";
import { backend } from "../lib/backend.js";
import { useI18n } from "../lib/i18n.js";

// 登录弹窗：邮箱 + 验证码两行，无多余文字。
// 发送后按钮进入 60 秒倒计时，倒计时结束变「重发」。
// 登录成功（本页填码 或 其他标签页完成）自动关闭。
export default function LoginSheet({ onClose }) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(
    () =>
      backend.auth.onChange((s) => {
        if (s) onClose();
      }),
    [onClose],
  );

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function send() {
    setBusy(true);
    setErr("");
    try {
      await backend.auth.requestCode(email.trim());
      setSent(true);
      setCooldown(60);
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    setBusy(true);
    setErr("");
    try {
      await backend.auth.verifyCode(email.trim(), code);
      onClose();
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  const emailOk = email.includes("@");

  return (
    <div className="sheet-overlay" onClick={onClose} role="dialog" aria-label={t("login.title")}>
      <div className="sheet-card" onClick={(e) => e.stopPropagation()}>
        <header className="sheet-head">
          <strong>{t("login.title")}</strong>
          <button type="button" className="sheet-close" onClick={onClose} aria-label={t("login.close")}>✕</button>
        </header>

        <div className="api-key-row">
          <input
            type="email"
            placeholder={t("login.email")}
            value={email}
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && emailOk && cooldown === 0) send();
            }}
            autoComplete="email"
          />
          <button
            type="button"
            className="api-key-save"
            disabled={busy || !emailOk || cooldown > 0}
            onClick={send}
          >
            {cooldown > 0 ? `${cooldown}s` : sent ? t("login.resend") : t("login.sendCode")}
          </button>
        </div>

        <div className="api-key-row">
          <input
            type="text"
            inputMode="numeric"
            placeholder={t("login.code")}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && code.trim().length >= 6) verify();
            }}
          />
          <button
            type="button"
            className="api-key-save"
            disabled={busy || code.trim().length < 6}
            onClick={verify}
          >
            {t("login.submit")}
          </button>
        </div>

        {err && <p className="api-key-hint u-mono sheet-err">{err}</p>}
      </div>
    </div>
  );
}
