import type { Session, Battle } from "../shared/types";
import { clone } from "../shared/document";
import { createMap } from "../features/terrain";
import { createUnits } from "../features/roster";
import { seedRound } from "../features/initiative";
export function newSession(): Session {
  const live: Battle = {
    tiles: createMap(),
    units: createUnits(),
    round: 1,
    queue: [],
    base: [],
    active: "",
    ended: null,
  };
  seedRound(live);
  live.active = live.queue[0];
  return { initial: clone(live), live, events: [] };
}
