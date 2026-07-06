// ============================================================
// 后端抽象层 —— App 与云端的唯一接触面（防供应商锁死的关键）
//
// 全 App 只允许从这里 import 云端能力，接口一共 6 组：
//   backend.mode                       "local" | "supabase"
//   backend.community.fetchAll()       → [{festival, performances}]
//   backend.community.publish(f, ps)   → void
//   backend.auth.requestCode(email) / verifyCode(email, code) / signOut() / getSession() / onChange(cb)
//   backend.userData.pull()            → { key: value }
//   backend.userData.push(patch)       → void
//
// 换后端（腾讯云 CloudBase / 自建 / LeanCloud…）= 重写本文件里的
// adapter 实现，保持上面的函数签名不变，其余代码零改动。
// 数据全部是普通 JSON（festival/performances 结构见 seed.js），
// 随时可以 select * 整体导出搬家。
//
// 配置：项目根目录 .env.local
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
// 两个都填了才启用云端；没填时 mode="local"，一切照旧存本机。
// anon key 本来就是设计为可公开的（安全靠数据库 RLS 策略，见 supabase/schema.sql）
// ============================================================

const SUPABASE_URL = (import.meta.env?.VITE_SUPABASE_URL || "").replace(/\/+$/, "");
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || "";
const ENABLED = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

const SESSION_KEY = "me:cloud_session";

// ---------- 会话存取 ----------
function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(session) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  } catch {}
}

const authListeners = new Set();
function emitAuth(session) {
  for (const cb of authListeners) {
    try { cb(session); } catch {}
  }
}

// ---------- HTTP 基础 ----------
function baseHeaders(withUserToken = true) {
  const h = {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON_KEY,
  };
  const s = loadSession();
  h.Authorization = `Bearer ${withUserToken && s?.access_token ? s.access_token : SUPABASE_ANON_KEY}`;
  return h;
}

async function refreshSession() {
  const s = loadSession();
  if (!s?.refresh_token) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
      body: JSON.stringify({ refresh_token: s.refresh_token }),
    });
    if (!res.ok) throw new Error(`refresh HTTP ${res.status}`);
    const json = await res.json();
    const next = {
      access_token: json.access_token,
      refresh_token: json.refresh_token,
      user: json.user,
    };
    saveSession(next);
    return next;
  } catch (e) {
    console.warn("[backend] 刷新会话失败，登出:", e);
    saveSession(null);
    emitAuth(null);
    return null;
  }
}

// 带 401 自动刷新重试的 fetch
async function api(path, options = {}, retry = true) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: { ...baseHeaders(), ...(options.headers || {}) },
  });
  if (res.status === 401 && retry && loadSession()) {
    const refreshed = await refreshSession();
    if (refreshed) return api(path, options, false);
  }
  return res;
}

// ---------- Supabase adapter ----------
const supabaseAdapter = {
  mode: "supabase",

  community: {
    // 拉取所有共享音乐节（festival + performances 都是 jsonb 原样存取）
    async fetchAll() {
      const res = await api(
        "/rest/v1/community_festivals?select=id,festival,performances&order=created_at.asc",
        { method: "GET" },
      );
      if (!res.ok) throw new Error(`fetchAll HTTP ${res.status}`);
      const rows = await res.json();
      return rows.map((r) => ({ festival: r.festival, performances: r.performances || [] }));
    },

    // 发布（需登录，RLS 强制）。同 id 重复发布 = 覆盖更新（upsert）。
    async publish(festival, performances) {
      const res = await api("/rest/v1/community_festivals", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates" },
        body: JSON.stringify([{ id: festival.id, festival, performances }]),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`publish HTTP ${res.status} · ${body.slice(0, 120)}`);
      }
    },
  },

  auth: {
    // 邮箱验证码（OTP）两步登录，免密码
    async requestCode(email) {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
        body: JSON.stringify({ email, create_user: true }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`发送验证码失败 HTTP ${res.status} · ${body.slice(0, 120)}`);
      }
    },

    async verifyCode(email, code) {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
        body: JSON.stringify({ email, token: code.trim(), type: "email" }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`验证码校验失败 HTTP ${res.status} · ${body.slice(0, 120)}`);
      }
      const json = await res.json();
      const session = {
        access_token: json.access_token,
        refresh_token: json.refresh_token,
        user: json.user,
      };
      saveSession(session);
      emitAuth(session);
      return session;
    },

    async signOut() {
      try {
        await api("/auth/v1/logout", { method: "POST" }, false);
      } catch {}
      saveSession(null);
      emitAuth(null);
    },

    getSession: loadSession,

    onChange(cb) {
      authListeners.add(cb);
      return () => authListeners.delete(cb);
    },
  },

  wishes: {
    // 许愿：写入 wishes 表（无 select 策略，提交后只有站长能在控制台看到）
    async submit({ festivalName, year, link }) {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/wishes`, {
        method: "POST",
        headers: baseHeaders(false),
        body: JSON.stringify([
          { festival_name: festivalName, year: year || null, link: link || null },
        ]),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`提交失败 HTTP ${res.status} · ${body.slice(0, 80)}`);
      }
    },
  },

  userData: {
    // 拉取当前用户的全部云端数据 → { key: value }
    async pull() {
      if (!loadSession()) return {};
      const res = await api("/rest/v1/user_data?select=key,value", { method: "GET" });
      if (!res.ok) throw new Error(`pull HTTP ${res.status}`);
      const rows = await res.json();
      const out = {};
      for (const r of rows) out[r.key] = r.value;
      return out;
    },

    // 推送若干 key（upsert）。patch = { key: value }
    async push(patch) {
      const s = loadSession();
      if (!s?.user?.id) return;
      const rows = Object.entries(patch).map(([key, value]) => ({
        user_id: s.user.id,
        key,
        value,
        updated_at: new Date().toISOString(),
      }));
      if (!rows.length) return;
      const res = await api("/rest/v1/user_data?on_conflict=user_id,key", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates" },
        body: JSON.stringify(rows),
      });
      if (!res.ok) throw new Error(`push HTTP ${res.status}`);
    },
  },
};

// ---------- 本地 adapter（没配云端时的空实现，一切照旧存 localStorage） ----------
const localAdapter = {
  mode: "local",
  community: {
    async fetchAll() { return []; },
    async publish() { /* 本地模式发布只存本机，由 storage.js 负责 */ },
  },
  auth: {
    async requestCode() { throw new Error("未配置云端（.env.local 填 VITE_SUPABASE_URL / KEY）"); },
    async verifyCode() { throw new Error("未配置云端"); },
    async signOut() {},
    getSession: () => null,
    onChange() { return () => {}; },
  },
  wishes: {
    async submit() { throw new Error("云端未配置 · 请用发邮件的方式许愿"); },
  },
  userData: {
    async pull() { return {}; },
    async push() {},
  },
};

// 魔法链接登录：邮件链接验证后 Supabase 会把 token 挂在回跳 URL 的 hash 里
// （#access_token=…&refresh_token=…）。App 启动时接住、存为会话、清掉 URL。
function consumeUrlSession() {
  if (typeof window === "undefined") return;
  const hash = window.location.hash;
  if (!hash || !hash.includes("access_token=")) return;
  const params = new URLSearchParams(hash.slice(1));
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  // 立刻清掉地址栏里的 token，避免被复制/存进历史
  history.replaceState(null, "", window.location.pathname + window.location.search);
  if (!access_token) return;
  fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${access_token}` },
  })
    .then((r) => (r.ok ? r.json() : null))
    .then((user) => {
      if (!user) return;
      const session = { access_token, refresh_token, user };
      saveSession(session);
      emitAuth(session);
    })
    .catch((e) => console.warn("[backend] 魔法链接会话获取失败:", e));
}

if (ENABLED) consumeUrlSession();

// 跨标签页会话同步：用户在新标签页点魔法链接登录成功后，
// 原页面立刻感知（登录弹窗自动关闭、状态变已登录）
if (ENABLED && typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === SESSION_KEY) emitAuth(loadSession());
  });
}

export const backend = ENABLED ? supabaseAdapter : localAdapter;
