<template>
  <div class="ayah-content">
    <TransitionGroup name="ayah-list" tag="div" class="ayah-list">
      <article
        v-for="(item, index) in ayahs"
        :key="item.number"
        :ref="el => setCardRef(el, index)"
        class="ayah-card"
        :class="[
          index === 0 ? 'ayah-card--current' : 'ayah-card--next',
          !item.revealed && 'is-hidden',
        ]"
        :role="!item.revealed ? 'button' : undefined"
        :tabindex="!item.revealed ? 0 : -1"
        @click="!item.revealed && $emit('reveal', index)"
        @keydown.enter.space.prevent="!item.revealed && $emit('reveal', index)"
      >
        <header class="ayah-card__header">
          <span class="ayah-card__label">
            {{ index === 0 ? $t('lbl_current_ayah') : nextLabel(index) }}
          </span>
          <span v-if="item.revealed && item.data?.numberInSurah" class="ayah-card__badge">
            {{ item.data.surah?.englishName }} · {{ item.data.numberInSurah }}
          </span>
        </header>

        <p v-if="item.revealed" class="ayah-text" dir="rtl">{{ item.data.text }}</p>

        <div v-else class="reveal-placeholder">
          <div class="reveal-placeholder__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <p class="reveal-placeholder__text">{{ $t('lbl_tap_to_reveal') }}</p>
        </div>
      </article>
    </TransitionGroup>

    <div class="actions">
      <button class="action-btn action-btn--primary" @click="$emit('next')">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10"/>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
        {{ $t('lbl_new_ayah') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  ayahs: {
    type: Array,
    default: () => [],
  },
})
defineEmits(['reveal', 'next'])

const cardRefs = ref([])
function setCardRef(el, index) {
  if (el) cardRefs.value[index] = el
}

function nextLabel(index) {
  return index === 1 ? t('lbl_next_ayah') : `${t('lbl_next_ayah')} +${index - 1}`
}

watch(() => props.ayahs.length, async (newLen, oldLen) => {
  if (newLen > oldLen && oldLen > 0) {
    await nextTick()
    const lastCard = cardRefs.value[newLen - 1]
    if (lastCard && typeof lastCard.scrollIntoView === 'function') {
      lastCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }
  if (newLen < oldLen) {
    cardRefs.value = cardRefs.value.slice(0, newLen)
  }
})
</script>

<style scoped>
.ayah-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ayah-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ayah-card {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 22px 20px;
  box-shadow: var(--shadow-md);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.ayah-card--current {
  background: linear-gradient(180deg, #ffffff 0%, #f5fbf7 100%);
}

.ayah-card--next {
  background: linear-gradient(180deg, #ffffff 0%, #eff9f3 100%);
  border-style: solid;
}

.ayah-card--next.is-hidden {
  cursor: pointer;
  border-style: dashed;
  border-color: var(--main-color-soft);
}

.ayah-card--next.is-hidden:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.ayah-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.ayah-card__label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--main-color);
}

.ayah-card__badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--light);
  color: var(--main-color);
  border: 1px solid var(--border-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%;
}

.ayah-text {
  margin: 0;
  font-size: 22px;
  line-height: 2.2;
  text-align: right;
  color: var(--dark);
  font-family: "Amiri Quran", "Scheherazade New", "Traditional Arabic", "Amiri", serif;
  word-spacing: 4px;
  font-feature-settings: "liga", "calt";
}

.reveal-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 28px 12px;
  color: var(--main-color);
}

.reveal-placeholder__icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--light);
  border: 1px solid var(--border-color);
}

.reveal-placeholder__text {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
}

.actions {
  display: flex;
  justify-content: center;
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
  transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  background: var(--light);
}

.action-btn--primary {
  background: linear-gradient(135deg, var(--main-color-soft), var(--main-color));
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 10px 24px rgba(15, 122, 74, 0.24);
}

.action-btn--primary:hover {
  background: linear-gradient(135deg, var(--main-color-soft), var(--main-color));
  color: #ffffff;
}

/* TransitionGroup: new card slides in, old fades out */
.ayah-list-enter-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.ayah-list-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  position: absolute;
}
.ayah-list-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.ayah-list-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (min-width: 640px) {
  .ayah-card {
    padding: 28px 28px;
  }
  .ayah-text {
    font-size: 28px;
    line-height: 2.3;
  }
  .reveal-placeholder {
    padding: 40px 12px;
  }
}
</style>
