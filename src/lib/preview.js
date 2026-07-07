// 30 秒试听：iTunes Search API（免 key、免注册、浏览器可直连、国内可访问）。
// 用艺人名搜第一首歌，拿它的 previewUrl 播放。
//
// 已知局限：艺人名是常见词时可能搜到同名歌（如"野孩子"→ 杨千嬅的歌）。
// 无法完全避免；对多数音乐节艺人够用。

// 内存缓存：艺人名 → { previewUrl, trackName, artistName } 或 null（搜过没结果）
const cache = new Map();

// 单例 audio：保证同一时间只播一首
let audio = null;
let currentUrl = null;

export async function searchPreview(name) {
  const key = name.trim();
  if (cache.has(key)) return cache.get(key);
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(key)}&entity=musicTrack&limit=1`;
    const res = await fetch(url);
    const json = await res.json();
    const t = json.results?.[0];
    const result = t?.previewUrl
      ? { previewUrl: t.previewUrl, trackName: t.trackName, artistName: t.artistName }
      : null;
    cache.set(key, result);
    return result;
  } catch (e) {
    console.warn("[preview] 搜索失败:", e);
    return null; // 不缓存网络错误，下次可重试
  }
}

// 播放某个 url。onEnd 在自然播完/被打断/出错时都会调用一次。
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
