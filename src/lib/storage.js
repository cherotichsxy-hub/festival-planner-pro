import { seedPerformances } from "../data/seed.js";

// 区分两种 namespace：
//   community:*  → 模拟公共数据（任何人都能编辑发布的时间表）
//   me:*         → 个人数据（Must-see / 待定 等私人偏好）
// 真实产品里 community 应换成后端 API；me 可绑账号。

const KEYS = {
  festivals: "community:festivals",
  performances: "community:performances",
  selections: "me:selections",
  // 每场演出的个人备注（hint）：{ festivalId: { perfId: "文字" } }
  notes: "me:notes",
  headliners: "me:headliners",
  // 用户在主轴/备选撞档冲突中点过的"主轴选择"：{ festivalId: { perfId: true } }
  axisChoice: "me:axisChoice",
  // 实际去过的音乐节：{ festivalId: true }（区别于"标注感兴趣"）
  attended: "me:attended",
  // 想看的音乐节：{ festivalId: true }（还没开始做计划，先收藏）
  wanted: "me:wanted",
  seedVersion: "community:seed_version",
};

// 每次 seed 数据有意义改动就 bump 这个版本号。阵容临时变更必须保留原 performance id，
// 并只更新受影响时段或追加官方新时段，避免清空其他音乐节和 me:* 个人标记。
const SEED_VERSION = "pro-2026-multi-v6-fuji-lineup";
const SEED_PERFORMANCE_UPSERT_IDS = new Set([
  "fr-d1-r3",
  "fr-d3-g7",
  "fr-d3-r2",
  "fr-d3-h5",
]);

export function migrateIfStale() {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(KEYS.seedVersion);
  if (stored !== SEED_VERSION) {
    try {
      const raw = localStorage.getItem(KEYS.performances);
      const current = raw ? JSON.parse(raw) : null;
      if (Array.isArray(current)) {
        const updates = new Map(
          seedPerformances
            .filter((perf) => SEED_PERFORMANCE_UPSERT_IDS.has(perf.id))
            .map((perf) => [perf.id, perf]),
        );
        const existingIds = new Set(current.map((perf) => perf.id));
        const next = current.map((perf) => {
          const update = updates.get(perf.id);
          return update ? { ...perf, ...update } : perf;
        });
        for (const [id, update] of updates) {
          if (!existingIds.has(id)) next.push(update);
        }
        localStorage.setItem(KEYS.performances, JSON.stringify(next));
      }
    } catch {
      // 缓存损坏时 load() 会回退到最新 seed；这里不碰其他 community/me 数据。
    }
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

export function loadNotes() {
  return load(KEYS.notes, {});
}

export function saveNotes(value) {
  save(KEYS.notes, value);
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
