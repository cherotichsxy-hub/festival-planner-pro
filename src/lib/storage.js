// 区分两种 namespace：
//   community:*  → 模拟公共数据（任何人都能编辑发布的时间表）
//   me:*         → 个人数据（Must-see / 待定 等私人偏好）
// 真实产品里 community 应换成后端 API；me 可绑账号。

const KEYS = {
  festivals: "community:festivals",
  performances: "community:performances",
  selections: "me:selections",
  headliners: "me:headliners",
  // 用户在主轴/备选撞档冲突中点过的"主轴选择"：{ festivalId: { perfId: true } }
  axisChoice: "me:axisChoice",
  // 实际去过的音乐节：{ festivalId: true }（区别于"标注感兴趣"）
  attended: "me:attended",
  // 想看的音乐节：{ festivalId: true }（还没开始做计划，先收藏）
  wanted: "me:wanted",
  seedVersion: "community:seed_version",
};

// 每次 seed 数据有意义改动就 bump 这个版本号，让用户浏览器里的旧缓存自动作废。
// 不会影响 me:selections（用户的个人标记）—— 只清 community 数据。
const SEED_VERSION = "pro-2026-multi-v3-newsoil";

export function migrateIfStale() {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(KEYS.seedVersion);
  if (stored !== SEED_VERSION) {
    // 多音乐节版本：仅清 community 数据（让 seed 重置），保留用户所有 me:* 偏好
    localStorage.removeItem(KEYS.festivals);
    localStorage.removeItem(KEYS.performances);
    localStorage.setItem(KEYS.seedVersion, SEED_VERSION);
  }
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFestivals(fallback) {
  return load(KEYS.festivals, fallback);
}

export function saveFestivals(value) {
  save(KEYS.festivals, value);
}

export function loadPerformances(fallback) {
  return load(KEYS.performances, fallback);
}

export function savePerformances(value) {
  save(KEYS.performances, value);
}

export function loadSelections() {
  return load(KEYS.selections, {});
}

export function saveSelections(value) {
  save(KEYS.selections, value);
}

export function loadHeadliners() {
  return load(KEYS.headliners, {});
}

export function saveHeadliners(value) {
  save(KEYS.headliners, value);
}

export function loadAxisChoice() {
  return load(KEYS.axisChoice, {});
}

export function saveAxisChoice(value) {
  save(KEYS.axisChoice, value);
}

export function loadAttended() {
  return load(KEYS.attended, {});
}

export function saveAttended(value) {
  save(KEYS.attended, value);
}

export function loadWanted() {
  return load(KEYS.wanted, {});
}

export function saveWanted(value) {
  save(KEYS.wanted, value);
}
