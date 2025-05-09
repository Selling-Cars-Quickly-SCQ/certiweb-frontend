import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';


import { createI18n } from 'vue-i18n';
import englishMessages from './assets/i18n/en.json'; 
import spanishMessages from './assets/i18n/es.json';
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'es',
  messages: {
    en: englishMessages,
    es: spanishMessages
  }
});

const app = createApp(App);
app.use(PrimeVue, { ripple: true });
app.use(i18n);

app.mount('#app');