import type { Battle } from "../../../shared/types";
import { findUnit } from "../../../shared/document";
import { outcome, seedRound } from "../lib/order";
export function finishTurn(
  b: Battle,
  tick: (u: ReturnType<typeof findUnit>) => void,
) {
  tick(findUnit(b, b.active));
  b.queue = b.queue.filter((id) => id !== b.active && findUnit(b, id).hp > 0);
  b.ended = outcome(b);
  if (b.ended) return;
  if (!b.queue.length) {
    b.round++;
    for (const u of b.units) {
      u.moved = false;
      u.acted = false;
      u.delayed = false;
    }
    seedRound(b);
  }
  b.active = b.queue[0];
}
export function delayTurn(b: Battle) {
  const u = findUnit(b, b.active);
  if (u.delayed) throw new Error("本轮已延迟过，队尾必须行动");
  if (u.moved || u.acted) throw new Error("行动已开始，无法延迟");
  if (b.queue.length <= 1) throw new Error("队列末尾无人接替，必须行动");
  u.delayed = true;
  b.queue = [...b.queue.filter((id) => id !== b.active), b.active];
  b.active = b.queue[0];
}
