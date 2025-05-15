import { createRouter, createWebHistory } from 'vue-router'

import toolbarComponent from '../certifications/components/dashboard/toolbar/toolbar.component.vue';
import dashboardComponent from '../certifications/components/dashboard/dashboard.component.vue';
import RegisterComponent from '../public/pages/register/register.component.vue';
import LoginComponent from '../public/pages/login/login.component.vue';
import profileComponent from '../public/pages/profile/profile.component.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: dashboardComponent
  },
  {
    path: '/dashboard',
    redirect: '/' 
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
  },
  {
    path: '/profile',
    name: 'Profile',
    component: profileComponent
  }
]

const router = createRouter({
  history: createWebHistory("/certiweb-app/"),
  routes
})

router.beforeEach((to, from, next) => {
  const hasSession = !!localStorage.getItem('currentSession');

  const publicPages = ['/register', '/login'];
  const isPublicPage = publicPages.includes(to.path);

  if (!hasSession) { 
    if (isPublicPage) {
      next();
    } else {
      next('/register');
    }
  } else {
    if (to.path === '/register' || to.path === '/login') {
      next('/');
    } else {
      next();
    }
  }
});

export default router