import { createRouter, createWebHistory } from 'vue-router'

import toolbarComponent from '../certifications/components/dashboard/toolbar/toolbar.component.vue';
import dashboardComponent from '../certifications/components/dashboard/dashboard.component.vue';
import RegisterComponent from '../public/pages/register/register.component.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: dashboardComponent
  },
  {
    path: '/toolbar',
    name: 'Toolbar',
    component: toolbarComponent
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterComponent
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router