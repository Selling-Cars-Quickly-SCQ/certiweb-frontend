import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';

import router from "./router/index.js";
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import Message from 'primevue/message';
import Card from 'primevue/card';
import Steps from 'primevue/steps';
import Toolbar from 'primevue/toolbar'
import Avatar from 'primevue/avatar'
import Select from 'primevue/select';
import Checkbox from 'primevue/checkbox';
import CheckboxGroup from 'primevue/checkboxgroup';


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
app.use(PrimeVue);
app.component('pv-inputText', InputText);
app.component('pv-password', Password);
app.component('pv-selectButton', SelectButton);
app.component('pv-message', Message);
app.component('pv-card', Card);
app.component('pv-steps', Steps);
app.component('pv-checkbox', Checkbox);
app.component('pv-checkboxgroup', CheckboxGroup);
app.use(i18n);
app.use(router);
app.component('pv-button', Button);
app.component('pv-toolbar', Toolbar);
app.component('pv-avatar', Avatar);
app.component('pv-select', Select);

app.mount('#app');