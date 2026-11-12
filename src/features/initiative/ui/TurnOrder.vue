<script setup lang="ts">
import { computed } from "vue";
import type { Battle } from "../../../shared/types";
import { speedValue } from "../../roster";
import { turnLabel, turnProgress } from "../model/clock";
const props = defineProps<{ battle: Battle }>();
const items = computed(() =>
  props.battle.queue.map((id, i) => {
    const unit = props.battle.units.find((u) => u.id === id);
    return {
      id,
      pos: i + 1,
      unit,
      slowed: !!unit && speedValue(unit) < unit.speed,
    };
  }),
);
</script>
<template>
  <section class="turn-strip">
    <div>
      <div class="eyebrow">INITIATIVE / 预计行动序列 · 随状态实时重排</div>
      <h3>{{ turnLabel(battle) }}</h3>
    </div>
    <div class="queue">
      <span
        v-for="item in items"
        :key="item.id"
        :class="[
          'queue-item',
          item.unit?.team,
          { current: item.pos === 1, delayed: item.unit?.delayed },
        ]"
        ><small>{{ String(item.pos).padStart(2, "0") }}</small
        >{{ item.unit?.name
        }}<b :class="{ slowed: item.slowed }">{{
          item.unit ? speedValue(item.unit) : "?"
        }}</b
        ><i v-if="item.unit?.delayed">延迟</i></span
      >
    </div>
    <div class="round-meter">
      <b>{{ turnProgress(battle) }}%</b><small>回合进度</small>
    </div>
  </section>
</template>
