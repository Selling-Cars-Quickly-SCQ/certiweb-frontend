import { createRouter, createWebHistory } from 'vue-router'

import toolbarComponent from '../certifications/components/dashboard/toolbar/toolbar.component.vue';
import dashboardComponent from '../certifications/components/dashboard/dashboard.component.vue';

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router