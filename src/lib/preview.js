// 30 秒试听：iTunes Search API（免 key、免注册、浏览器可直连、国内可访问）。
//
// 关键：不能拿"艺人名 + 一堆修饰词"直接搜歌，会张冠李戴（Rrose [US] → 搜出别人的 Us）。
// 正确做法：清洗名字 → 先确认"艺人"存在拿到 artistId → 再精确取他本人的歌。
// 搜不到就老实返回 null（显示"无试听"），绝不硬塞一首名字沾边的歌。

const cache = new Map();

// —— 结果持久化：查过的结果（含"无试听"）存 localStorage，7 天有效 ——
// 这样"无试听"的艺人下次打开直接显示灰标签，不用再点、也不再重复打接口。
const LS_KEY = "fpp_preview_cache_v2"; // v1 是 /lookup 还在链路里的坏数据，弃用
const TTL = 7 * 24 * 3600 * 1000;

function loadStore() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    const now = Date.now();
    for (const [k, v] of Object.entries(raw)) {
      if (now - v.ts >= TTL) continue;
      cache.set(
        k,
        v.r ? { previewUrl: v.r.u, trackName: v.r.t, artistName: v.r.a } : null,
      );
    }
  } catch { /* 存储坏了就当没缓存 */ }
}
loadStore();

function persist(key, result) {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    const now = Date.now();
    for (const k of Object.keys(raw)) {
      if (now - raw[k].ts >= TTL) delete raw[k]; // 顺手清过期
    }
    raw[key] = {
      ts: now,
      r: result
        ? { u: result.previewUrl, t: result.trackName, a: result.artistName }
        : 0,
    };
    localStorage.setItem(LS_KEY, JSON.stringify(raw));
  } catch { /* 写不进就算了，内存缓存还在 */ }
}

let audio = null;
let currentUrl = null;

// 清洗艺人名：去掉 [US] (LIVE) (DJ) Vinyl Set / DJ Set / b2b 另一位 / feat. 等演出修饰
export function cleanArtistName(raw) {
  let s = String(raw || "");
  s = s.replace(/[\[（(].*?[\])）]/g, " "); // [US] (LIVE) （管乐版）
  s = s.replace(/\bb2b\b.*$/i, " ");         // b2b 后面是第二个 DJ，只搜第一个
  s = s.replace(/\bvs\.?\b.*$/i, " ");
  s = s.replace(/\b(vinyl set|dj set|live set|live|dj|feat\.?|ft\.?).*$/i, " ");
  s = s.replace(/[·・]/g, " ");
  return s.replace(/\s+/g, " ").trim();
}

// 两个名字是否算同一个人：normalize 后互相包含
function nameMatches(a, b) {
  const n = (x) => x.toLowerCase().replace(/[\s.\-_'"]/g, "");
  const na = n(a);
  const nb = n(b);
  if (!na || !nb) return false;
  return na.includes(nb) || nb.includes(na);
}

async function itunes(params) {
  const res = await fetch(`https://itunes.apple.com/${params}`);
  if (!res.ok) {
    const err = new Error(`itunes ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

// 真正的查询链（网络错误会往外抛，由调用方决定怎么兜底）。
// 注意：只能用 /search 端点。/lookup 在浏览器里会被 CORS 拦（Apple 不给它发
// CORS 头），curl 能通但页面里必挂——精确度改用 artistId 过滤搜歌结果来保证。
async function lookup(rawName) {
  const clean = cleanArtistName(rawName);
  if (!clean) return null;

  // 1. 先找"艺人"，确认这个人真在 iTunes（拿 artistId 用于第 2 步精确过滤）
  const artistRes = await itunes(
    `search?term=${encodeURIComponent(clean)}&entity=musicArtist&limit=5`,
  );
  const artist = (artistRes.results || []).find((a) =>
    nameMatches(a.artistName, clean),
  );

  // 2. 搜歌：优先 artistId 严格吻合，其次歌手名吻合（绝不硬塞名字沾边的歌）
  const songRes = await itunes(
    `search?term=${encodeURIComponent(clean)}&entity=musicTrack&limit=25`,
  );
  const songs = (songRes.results || []).filter((r) => r.previewUrl);
  const track =
    (artist && songs.find((r) => r.artistId === artist.artistId)) ||
    songs.find((r) => nameMatches(r.artistName, clean));

  return track?.previewUrl
    ? { previewUrl: track.previewUrl, trackName: track.trackName, artistName: track.artistName }
    : null;
}

// 同步读缓存：undefined = 还没查过；null = 确认无试听；对象 = 有试听
export function getCachedPreview(rawName) {
  const key = String(rawName || "").trim();
  return cache.has(key) ? cache.get(key) : undefined;
}

// —— 限流协调 ——
// iTunes 免费接口约 20 次/分钟，超了就整个 IP 被掐。被掐时错误响应不带
// CORS 头，浏览器里一律表现为 TypeError: Failed to fetch（拿不到状态码），
// 所以任何请求失败都按"疑似被限流"处理：全局退避，预查停手，手点让路。
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let throttledUntil = 0; // 这个时间点之前预查不发请求
let manualBusy = false; // 用户手点查询进行中，预查让路

function markThrottled(ms = 90_000) {
  throttledUntil = Math.max(throttledUntil, Date.now() + ms);
}

// 手点路径：优先级最高。失败当限流，歇 2 秒自动重试一次再放弃。
export async function searchPreview(rawName) {
  const key = rawName.trim();
  if (cache.has(key)) return cache.get(key);
  manualBusy = true;
  try {
    let result;
    try {
      result = await lookup(key);
    } catch {
      markThrottled(); // 让预查停手，把配额留给用户
      await sleep(2000);
      result = await lookup(key); // 再试一次，还不行就往外抛
    }
    cache.set(key, result);
    persist(key, result);
    return result;
  } catch (e) {
    console.warn("[preview] 搜索失败:", e);
    markThrottled();
    return null; // 网络错误不缓存，下次可重试
  } finally {
    manualBusy = false;
  }
}

// —— 后台预查：列表一渲染就排队查每个艺人有没有试听 ——
// 查到"无试听"的卡片直接显示灰标签，用户不用白点一次。
// 节奏放得很慢（6 秒一个艺人，每个固定 2 个请求，贴着 20 次/分钟的额度走）；
// 结果缓存 7 天，所以只有第一次打开慢慢灰，之后都是秒出。
let prefetchToken = 0;

export function prefetchPreviews(rawNames, onResult) {
  const token = ++prefetchToken; // 新一轮开始，旧一轮自然停
  const queue = [...new Set(rawNames.map((n) => String(n || "").trim()))]
    .filter((k) => k && !cache.has(k));

  (async () => {
    let failures = 0;
    for (const key of queue) {
      // 尊重全局退避 + 给手点让路
      while (Date.now() < throttledUntil || manualBusy) {
        await sleep(3000);
        if (token !== prefetchToken) return;
      }
      if (token !== prefetchToken) return;
      if (cache.has(key)) continue; // 可能被用户手点查过了
      let result;
      try {
        result = await lookup(key);
        failures = 0;
      } catch {
        failures += 1;
        markThrottled(); // 拿不到状态码，一律当限流：歇 90 秒
        if (failures >= 2) return; // 连续两次失败，放弃本轮，别刷爆接口
        continue; // 这个艺人保持"未知"，下轮再说
      }
      cache.set(key, result);
      persist(key, result);
      onResult?.(key, result);
      await sleep(6000);
    }
  })();

  return () => {
    if (token === prefetchToken) prefetchToken++;
  };
}

export function playPreview(url, onEnd) {
  stopPreview();
  audio = new Audio(url);
  currentUrl = url;
  const done = () => {
    if (currentUrl === url) {
      currentUrl = null;
      onEnd?.();
    }
  };
  audio.addEventListener("ended", done);
  audio.addEventListener("error", done);
  audio.play().catch(done);
}

export function stopPreview() {
  if (audio) {
    audio.pause();
    audio.src = "";
    audio = null;
  }
  currentUrl = null;
}

export function isPlaying(url) {
  return currentUrl === url;
}
