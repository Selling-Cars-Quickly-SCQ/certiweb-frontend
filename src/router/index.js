import { createRouter, createWebHistory } from 'vue-router'

import toolbarComponent from '../certifications/components/dashboard/toolbar/toolbar.component.vue';
import dashboardComponent from '../certifications/components/dashboard/dashboard.component.vue';
import RegisterComponent from '../public/pages/register/register.component.vue';
import LoginComponent from '../public/pages/login/login.component.vue';

const routes = [
  {
    path: '/',
    path: '/dashboard',
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
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginComponent
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router