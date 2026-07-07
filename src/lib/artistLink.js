import { cleanArtistName } from "./preview.js";

// 艺人跳转链接：
//  - 有官方介绍页（如 Fuji Rock seed 里带的 link）→ 直接用官方页，信息最准
//  - 没有 → 拼一个网易云音乐的歌手搜索页（零数据零接口，所有艺人都有入口）
export function artistLink(perf) {
  if (perf?.link) return perf.link;
  const name = cleanArtistName(perf?.artistName || "") || perf?.artistName || "";
  if (!name.trim()) return null;
  // type=100 = 歌手；手机上会打开网易云 m 站搜索（装了 App 的浏览器会提示打开 App）
  return `https://music.163.com/#/search/m/?s=${encodeURIComponent(name)}&type=100`;
}

// 是否官方页（决定图标：官方 ↗ / 网易云搜索 ♪）
export function isOfficialLink(perf) {
  return !!perf?.link;
}
