<template>
  <div class="rep-content">
    <TransitionGroup name="rep-history" tag="div" class="history" v-if="history.length">
      <div
        v-for="item in history"
        :key="item.id"
        class="history-row"
      >
        <span class="history-row__label">
          {{ $t('lbl_ayah') }} {{ item.id }}
        </span>
        <span class="history-row__count">
          {{ item.count }} {{ $t('lbl_times') }}
        </span>
      </div>
    </TransitionGroup>

    <article class="rep-card">
      <header class="rep-card__header">
        <span class="rep-card__label">
          {{ $t('lbl_ayah') }} {{ currentIndex }}
        </span>
      </header>

      <div class="counter">
        <span class="counter__label">{{ $t('lbl_repetitions') }}</span>
        <Transition name="count-pop" mode="out-in">
          <span :key="count" class="counter__value">{{ count }}</span>
        </Transition>
      </div>

      <button
        class="plus-btn"
        type="button"
        :aria-label="$t('lbl_add_one')"
        @click="increment"
      >
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      <div class="rep-actions">
        <button
          class="action-btn action-btn--ghost"
          type="button"
          :disabled="count === 0"
          @click="resetCount"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
          </svg>
          {{ $t('lbl_reset') }}
        </button>

        <button
          class="action-btn action-btn--primary"
          type="button"
          :disabled="count === 0"
          @click="nextAyah"
        >
          {{ $t('lbl_next') }}
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </article>

    <button
      v-if="history.length"
      type="button"
      class="clear-btn"
      @click="clearHistory"
    >
      {{ $t('lbl_clear_history') }}
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const history = ref([])
const count = ref(0)

const currentIndex = computed(() => history.value.length + 1)

function increment() {
  count.value += 1
}

function resetCount() {
  count.value = 0
}

function nextAyah() {
  if (count.value === 0) return
  history.value = [
    ...history.value,
    { id: currentIndex.value, count: count.value },
  ]
  count.value = 0
}

function clearHistory() {
  history.value = []
  count.value = 0
}
</script>

<style scoped>
.rep-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.history {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 18px;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  opacity: 0.7;
}

.history-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px dashed var(--border-color);
  color: var(--text-muted);
}

.history-row:last-child {
  border-bottom: none;
}

.history-row__label {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.history-row__count {
  font-size: 13px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--light);
  border: 1px solid var(--border-color);
}

.rep-card {
  background: linear-gradient(180deg, #ffffff 0%, #f5fbf7 100%);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 24px 20px 26px;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.rep-card__header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rep-card__label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--main-color);
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--light);
  border: 1px solid var(--border-color);
}

.counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.counter__label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.counter__value {
  font-size: 72px;
  font-weight: 700;
  line-height: 1;
  color: var(--main-color);
  font-variant-numeric: tabular-nums;
}

.plus-btn {
  appearance: none;
  border: none;
  cursor: pointer;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--main-color-soft), var(--main-color));
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 14px 30px rgba(15, 122, 74, 0.32);
  transition: transform 0.12s ease, box-shadow 0.15s ease, filter 0.15s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.plus-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(15, 122, 74, 0.36);
}

.plus-btn:active {
  transform: scale(0.94);
  filter: brightness(0.97);
}

.rep-actions {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding-top: 4px;
}

.action-btn {
  appearance: none;
  border: 1px solid var(--border-color);
  background: #ffffff;
  color: var(--main-color);
  font-weight: 600;
  font-size: 14px;
  padding: 10px 16px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease, opacity 0.15s ease;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  background: var(--light);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.action-btn--ghost {
  color: var(--text-muted);
}

.action-btn--primary {
  background: linear-gradient(135deg, var(--main-color-soft), var(--main-color));
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 10px 24px rgba(15, 122, 74, 0.24);
}

.action-btn--primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--main-color-soft), var(--main-color));
  color: #ffffff;
}

.clear-btn {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 10px;
  align-self: center;
  border-radius: 8px;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.clear-btn:hover {
  color: var(--dark);
  background: var(--light);
}

.count-pop-enter-active,
.count-pop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.count-pop-enter-from {
  opacity: 0;
  transform: scale(0.6);
}
.count-pop-leave-to {
  opacity: 0;
  transform: scale(1.2);
}

.rep-history-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.rep-history-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.rep-history-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.rep-history-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (min-width: 640px) {
  .counter__value {
    font-size: 96px;
  }
  .plus-btn {
    width: 112px;
    height: 112px;
  }
}
</style>
