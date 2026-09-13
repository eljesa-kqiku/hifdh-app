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
          <div v-if="item.revealed" class="ayah-card__meta">
            <Transition name="badge-pop">
              <span
                v-if="isInfoVisible(item.number) && item.data?.numberInSurah"
                class="ayah-card__badge"
              >
                {{ surahName(item.data.surah) }} · {{ localizeNumber(item.data.numberInSurah, locale) }}
              </span>
            </Transition>
            <button
              v-if="item.data?.numberInSurah"
              type="button"
              class="icon-btn"
              :class="{ active: isInfoVisible(item.number) }"
              :aria-label="isInfoVisible(item.number) ? $t('lbl_hide_info') : $t('lbl_show_info')"
              @click.stop="toggleInfo(item.number)"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="11" x2="12" y2="16"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </button>
            <button
              type="button"
              class="icon-btn"
              :class="{ playing: isPlaying(item.number), loading: isLoading(item.number) }"
              :aria-label="isPlaying(item.number) ? $t('lbl_pause') : $t('lbl_play')"
              @click.stop="togglePlay(item.number)"
            >
              <span v-if="isLoading(item.number)" class="icon-btn__spinner" aria-hidden="true"></span>
              <svg
                v-else-if="isPlaying(item.number)"
                viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"
              >
                <rect x="6" y="5" width="4" height="14" rx="1"/>
                <rect x="14" y="5" width="4" height="14" rx="1"/>
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"
              >
                <path d="M8 5.14v13.72a1 1 0 0 0 1.55.83l10.4-6.86a1 1 0 0 0 0-1.66L9.55 4.31A1 1 0 0 0 8 5.14z"/>
              </svg>
            </button>
          </div>
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
import { nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useI18n } from 'vue-i18n'
import { localizeNumber } from "@/common/numerals.js"

const { t, locale } = useI18n()

function surahName(surah) {
  if (!surah) return ''
  return locale.value === 'ar' ? surah.name : surah.englishName
}

const RECITER_EDITION = 'ar.alafasy'
const AUDIO_BASE = `https://cdn.islamic.network/quran/audio/128/${RECITER_EDITION}`

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
  return index === 1 ? t('lbl_next_ayah') : `${t('lbl_next_ayah')} +${localizeNumber(index - 1, locale.value)}`
}

const playingNumber = ref(null)
const loadingNumber = ref(null)
const infoVisible = ref(new Set())
let audio = null

function isPlaying(number) {
  return playingNumber.value === number
}
function isLoading(number) {
  return loadingNumber.value === number
}
function isInfoVisible(number) {
  return infoVisible.value.has(number)
}
function toggleInfo(number) {
  const next = new Set(infoVisible.value)
  if (next.has(number)) next.delete(number)
  else next.add(number)
  infoVisible.value = next
}

function stopAudio() {
  if (audio) {
    audio.pause()
    audio.src = ''
  }
  playingNumber.value = null
  loadingNumber.value = null
}

function togglePlay(number) {
  if (playingNumber.value === number) {
    stopAudio()
    return
  }

  if (audio) {
    audio.pause()
  } else {
    audio = new Audio()
    audio.preload = 'auto'
    audio.addEventListener('ended', () => {
      playingNumber.value = null
    })
    audio.addEventListener('error', () => {
      loadingNumber.value = null
      playingNumber.value = null
    })
    audio.addEventListener('playing', () => {
      loadingNumber.value = null
    })
  }

  loadingNumber.value = number
  playingNumber.value = null
  audio.src = `${AUDIO_BASE}/${number}.mp3`
  const playPromise = audio.play()
  if (playPromise && typeof playPromise.then === 'function') {
    playPromise
      .then(() => {
        playingNumber.value = number
      })
      .catch(() => {
        loadingNumber.value = null
        playingNumber.value = null
      })
  }
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
    stopAudio()
    infoVisible.value = new Set()
  }
})

onBeforeUnmount(() => {
  stopAudio()
  audio = null
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

.ayah-card__meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex-wrap: wrap;
  justify-content: flex-end;
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
}

.icon-btn {
  appearance: none;
  border: 1px solid var(--border-color);
  background: #ffffff;
  color: var(--main-color);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex: 0 0 auto;
  padding: 0;
  box-shadow: var(--shadow-sm);
  transition: transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.icon-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  background: var(--light);
}

.icon-btn.active {
  background: var(--light);
  border-color: var(--main-color-soft);
}

.icon-btn.playing {
  background: linear-gradient(135deg, var(--main-color-soft), var(--main-color));
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 6px 16px rgba(15, 122, 74, 0.3);
}

.icon-btn.playing:hover {
  background: linear-gradient(135deg, var(--main-color-soft), var(--main-color));
  color: #ffffff;
}

.icon-btn.loading {
  cursor: wait;
}

.icon-btn__spinner {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  border-top-color: var(--main-color);
  animation: spin 0.9s linear infinite;
}

.badge-pop-enter-active,
.badge-pop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.badge-pop-enter-from,
.badge-pop-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

@keyframes spin {
  to { transform: rotate(360deg); }
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
