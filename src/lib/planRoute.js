import { overlaps } from "./conflicts.js";

function rank(perf, selections, headliners, axisChoice) {
  return [
    axisChoice[perf.id] ? 1 : 0,
    headliners.includes(perf.id) ? 1 : 0,
    selections[perf.id] === "must" ? 1 : 0,
  ];
}

function compareRank(a, b, selections, headliners, axisChoice) {
  const ar = rank(a, selections, headliners, axisChoice);
  const br = rank(b, selections, headliners, axisChoice);
  for (let i = 0; i < ar.length; i += 1) {
    if (ar[i] !== br[i]) return br[i] - ar[i];
  }
  return new Date(a.startAt) - new Date(b.startAt);
}

function overlapMinutes(a, b) {
  const start = Math.max(new Date(a.startAt).getTime(), new Date(b.startAt).getTime());
  const end = Math.min(new Date(a.endAt).getTime(), new Date(b.endAt).getTime());
  return Math.max(0, (end - start) / 60000);
}

/**
 * Turn marked performances into a conflict-free primary route plus subordinate
 * alternatives. Pairwise overlap edges remain the source of truth, so a chain
 * A↔B↔C can still keep A and C in the primary route when they do not overlap.
 */
export function buildPlanRoute(
  items,
  selections,
  headliners = [],
  axisChoice = {},
) {
  const ranked = [...items].sort((a, b) =>
    compareRank(a, b, selections, headliners, axisChoice),
  );
  const primaries = [];

  for (const perf of ranked) {
    if (!primaries.some((chosen) => overlaps(perf, chosen))) {
      primaries.push(perf);
    }
  }
  primaries.sort((a, b) => new Date(a.startAt) - new Date(b.startAt));

  const primaryIds = new Set(primaries.map((perf) => perf.id));
  const alternativesByPrimary = Object.fromEntries(
    primaries.map((perf) => [perf.id, []]),
  );

  for (const perf of items) {
    if (primaryIds.has(perf.id)) continue;
    const conflictingPrimaries = primaries.filter((primary) => overlaps(perf, primary));
    if (conflictingPrimaries.length === 0) continue;

    const anchor = [...conflictingPrimaries].sort((a, b) => {
      const overlapDelta = overlapMinutes(perf, b) - overlapMinutes(perf, a);
      return overlapDelta || new Date(a.startAt) - new Date(b.startAt);
    })[0];
    alternativesByPrimary[anchor.id].push({
      perf,
      conflictingPrimaryIds: conflictingPrimaries.map((primary) => primary.id),
    });
  }

  for (const alternatives of Object.values(alternativesByPrimary)) {
    alternatives.sort((a, b) => new Date(a.perf.startAt) - new Date(b.perf.startAt));
  }

  return { primaries, alternativesByPrimary };
}
