// 30 秒试听：iTunes Search API（免 key、免注册、浏览器可直连、国内可访问）。
//
// 关键：不能拿"艺人名 + 一堆修饰词"直接搜歌，会张冠李戴（Rrose [US] → 搜出别人的 Us）。
// 正确做法：清洗名字 → 先确认"艺人"存在拿到 artistId → 再精确取他本人的歌。
// 搜不到就老实返回 null（显示"无试听"），绝不硬塞一首名字沾边的歌。

const cache = new Map();

let audio = null;
let currentUrl = null;

// 清洗艺人名：去掉 [US] (LIVE) (DJ) Vinyl Set / DJ Set / b2b 另一位 / feat. 等演出修饰
function cleanArtistName(raw) {
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
  return res.json();
}

export async function searchPreview(rawName) {
  const key = rawName.trim();
  if (cache.has(key)) return cache.get(key);
  const clean = cleanArtistName(rawName);
  if (!clean) {
    cache.set(key, null);
    return null;
  }
  try {
    // 1. 先找"艺人"，确认这个人真在 iTunes（拿 artistId）
    const artistRes = await itunes(
      `search?term=${encodeURIComponent(clean)}&entity=musicArtist&limit=5`,
    );
    const artist = (artistRes.results || []).find((a) =>
      nameMatches(a.artistName, clean),
    );

    let track = null;
    if (artist) {
      // 2. 用 artistId 精确取他本人的歌（绝不串到同名歌）
      const songRes = await itunes(
        `lookup?id=${artist.artistId}&entity=song&limit=6`,
      );
      track = (songRes.results || []).find((r) => r.kind === "song" && r.previewUrl);
    }

    // 3. 兜底：没找到艺人/艺人没上架歌，再搜一次歌，但严格要求歌手名吻合
    if (!track) {
      const songRes = await itunes(
        `search?term=${encodeURIComponent(clean)}&entity=musicTrack&limit=5`,
      );
      track = (songRes.results || []).find(
        (r) => r.previewUrl && nameMatches(r.artistName, clean),
      );
    }

    const result = track?.previewUrl
      ? { previewUrl: track.previewUrl, trackName: track.trackName, artistName: track.artistName }
      : null;
    cache.set(key, result);
    return result;
  } catch (e) {
    console.warn("[preview] 搜索失败:", e);
    return null; // 网络错误不缓存，下次可重试
  }
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
