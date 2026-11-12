import type { Battle } from "../../../shared/types";
import { findUnit } from "../../../shared/document";
import { speedValue } from "../../roster";
export function order(b: Battle) {
  return b.units
    .filter((u) => u.hp > 0)
    .sort(
      (a, c) => speedValue(c) - speedValue(a) || a.id.localeCompare(c.id),
    )
    .map((u) => u.id);
}
export function seedRound(b: Battle) {
  b.queue = order(b);
  b.base = [...b.queue];
}
export function reorder(b: Battle) {
  const alive = new Set(b.units.filter((u) => u.hp > 0).map((u) => u.id));
  const head = alive.has(b.active) ? [b.active] : [];
  const seen = new Set(head);
  const pending: string[] = [],
    delayed: string[] = [];
  for (const id of b.queue) {
    if (seen.has(id) || !alive.has(id)) continue;
    seen.add(id);
    (findUnit(b, id).delayed ? delayed : pending).push(id);
  }
  const rank = (id: string) => {
    const i = b.base.indexOf(id);
    return i < 0 ? b.base.length : i;
  };
  pending.sort(
    (a, c) =>
      speedValue(findUnit(b, c)) - speedValue(findUnit(b, a)) ||
      rank(a) - rank(c),
  );
  b.queue = [...head, ...pending, ...delayed];
}
export function outcome(b: Battle) {
  const teams = new Set(b.units.filter((u) => u.hp > 0).map((u) => u.team));
  return teams.size <= 1 ? (teams.values().next().value ?? "draw") : null;
}
