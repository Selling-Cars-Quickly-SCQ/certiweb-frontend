import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';
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
import Dialog from 'primevue/dialog';
import FileUpload from 'primevue/fileupload';
import DatePicker from 'primevue/datepicker';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';
import Carousel from 'primevue/carousel';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';

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
app.use(ToastService);
app.use(i18n);
app.use(router);

app.component('pv-inputText', InputText);
app.component('pv-password', Password);
app.component('pv-selectButton', SelectButton);
app.component('pv-message', Message);
app.component('pv-card', Card);
app.component('pv-steps', Steps);
app.component('pv-checkbox', Checkbox);
app.component('pv-checkboxgroup', CheckboxGroup);
app.component('pv-dialog', Dialog);
app.component('pv-fileupload', FileUpload);
app.component('pv-datePicker', DatePicker);
app.component('pv-toast', Toast);
app.component('pv-button', Button);
app.component('pv-toolbar', Toolbar);
app.component('pv-avatar', Avatar);
app.component('pv-select', Select);
app.component('pv-progress-spinner', ProgressSpinner);
app.component('pv-carousel', Carousel);
app.component('pv-input-number', InputNumber);
app.component('pv-textarea', Textarea);

app.mount('#app');