<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

/**
 * Current route object.
 * @type {import('vue-router').RouteLocationNormalizedLoaded}
 */
const route = useRoute();

/**
 * Router instance for navigation.
 * @type {import('vue-router').Router}
 */
const router = useRouter();

/**
 * Internationalization composable.
 * @type {Object}
 */
const { t } = useI18n();

/**
 * Navigates to the home page.
 */
const navigateToHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1 class="not-found-title">404</h1>
      <h2 class="not-found-subtitle">{{ t('pageNotFound.title') }}</h2>
      
      <p class="not-found-message">
        {{ t('pageNotFound.message', { path: route.path }) }}
      </p>
      
      <pv-button 
        class="home-button" 
        @click="navigateToHome"
      >
        {{ t('pageNotFound.returnHome') }}
      </pv-button>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  padding: 2rem;
  background-color: #fcfcfc;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.not-found-title {
  font-size: 6rem;
  margin: 0;
  color: #e74c3c;
  line-height: 1;
}

.not-found-subtitle {
  font-size: 2rem;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.not-found-message {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #7f8c8d;
}

.home-button {
  background-color: #3c7caa;
  color: rgb(255, 255, 255);
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.home-button:hover {
  background-color: #2980b9;
}

@media (max-width: 768px) {
  .not-found-title {
    font-size: 4rem;
  }
  
  .not-found-subtitle {
    font-size: 1.5rem;
  }
  
  .not-found-message {
    font-size: 1rem;
  }
}
</style>