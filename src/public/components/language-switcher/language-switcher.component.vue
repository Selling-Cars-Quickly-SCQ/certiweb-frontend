/**
 * Component that provides buttons to switch the application language (English/Spanish).
 * @summary Language switcher component.
 * @author Eric Agama Espinoza
 */
<script setup>
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';

/**
 * Internationalization composable.
 * @type {Object}
 */
const { t, locale } = useI18n();

/**
 * @type {import('vue').Ref<string>}
 * @description Currently selected language.
 */
const selectedLang = ref(locale.value);

/**
 * Switches the application language.
 * @param {string} lang - Language code ('en' or 'es').
 */
function switchLanguage(lang) {
  selectedLang.value = lang;
  locale.value = lang;
}

watch(locale, (newLocale) => {
  selectedLang.value = newLocale;
});
</script>

<template>
  <div class="language-switcher">
    <div class="language-buttons">
      <pv-button 
        class="lang-btn" 
        :class="{ active: selectedLang === 'en' }"
        @click="switchLanguage('en')"
      >
        <i class="pi pi-globe"></i>
        {{ t('language.english') }}
      </pv-button>
      <pv-button 
        class="lang-btn" 
        :class="{ active: selectedLang === 'es' }"
        @click="switchLanguage('es')"
      >
        <i class="pi pi-globe"></i>
        {{ t('language.spanish') }}
      </pv-button>
    </div>
  </div>
</template>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 1rem;
}

.language-buttons {
  display: flex;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  padding: 3px;
  gap: 3px;
}

.lang-btn {
  min-width: 90px;
  background-color: transparent !important;
  color: #495057 !important;
  border: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  padding: 0.6rem 1rem !important;
  font-weight: 500 !important;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  border-radius: 10px !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05) !important;
}

.lang-btn i {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.lang-btn.active {
  background: var(--primary-color, #3B82F6) !important;
  background-image: linear-gradient(135deg, var(--primary-color, #3B82F6) 0%, var(--primary-color-lighten, #60a5fa) 100%) !important;
  color: white !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
  transform: translateY(-1px);
  letter-spacing: 0.5px;
}

.lang-btn.active i {
  transform: scale(1.2);
  animation: pulse 1.5s infinite;
}

.lang-btn:hover:not(.active) {
  background-color: rgba(0, 0, 0, 0.04) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.lang-btn:active:not(.active) {
  transform: translateY(1px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
}

.lang-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, transparent 80%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lang-btn:hover::before {
  opacity: 1;
}

.lang-btn::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.7) 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform 0.5s, opacity 0.8s;
}

.lang-btn:active::after {
  transform: scale(0, 0);
  opacity: 0.4;
  transition: 0s;
}

@keyframes pulse {
  0% {
    filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0.7));
  }
  50% {
    filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.9));
  }
  100% {
    filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0.7));
  }
}

@media (max-width: 640px) {
  .lang-btn {
    min-width: 70px;
    padding: 0.5rem 0.7rem !important;
    font-size: 0.875rem;
  }
  
  .language-buttons {
    padding: 2px;
    gap: 2px;
  }
}
</style>