import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';
import router from "./router/index.js";
import Button from 'primevue/button'
import Toolbar from 'primevue/toolbar'
import Avatar from 'primevue/avatar'
import Select from 'primevue/select';


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
app.use(router);
app.component('pv-button', Button);
app.component('pv-toolbar', Toolbar);
app.component('pv-avatar', Avatar);
app.component('pv-select', Select);

app.mount('#app');