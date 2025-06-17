import { createRouter, createWebHistory } from 'vue-router'

import toolbarComponent from '../certifications/components/dashboard/toolbar/toolbar.component.vue';
import dashboardComponent from '../certifications/components/dashboard/dashboard.component.vue';
import RegisterComponent from '../public/pages/register/register.component.vue';
import LoginComponent from '../public/pages/login/login.component.vue';
import profileComponent from '../public/pages/profile/profile.component.vue';
import reservationComponent from '../certifications/components/reservation/reservation.component.vue';
import historyComponent from '../public/pages/history/history.component.vue';
import adminCertificationComponent from '../certifications/components/admin-certification/admin-certification.component.vue';
import CarListComponent from '../public/pages/car-list/CarList.vue';
import CarDetailComponent from '../public/pages/car-detail/CarDetail.vue';
import SupportComponent from '../public/pages/info/support.component.vue';
import TermsOfUseComponent from '../public/pages/info/terms-of-use.component.vue';
import pageNotFoundComponent from '../public/pages/page-not-found/page-not-found.component.vue'

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
  },
  {
    path: '/reservation',
    name: 'Reservation',
    component: reservationComponent
  },
  {
    path: '/history',
    name: 'History',
    component: historyComponent
  },
  {
    path: '/admin-certification',
    name: 'AdminCertification',
    component: adminCertificationComponent
  },
  {
    path: '/cars',
    name: 'CarList',
    component: CarListComponent
  },
  {
    path: '/car-detail/:id',
    name: 'CarDetail',
    component: CarDetailComponent
  },
  {
    path: '/support',
    name: 'Support',
    component: SupportComponent
  },
  {
    path: '/terms-of-use',
    name: 'TermsOfUse',
    component: TermsOfUseComponent
  },
  {
    path: '/:catchAll(.*)',
    name: 'PageNotFound',
    component: pageNotFoundComponent
  }
]

const router = createRouter({
  history: createWebHistory("/certiweb-frontend/"),
  routes
})

router.beforeEach((to, from, next) => {
  const sessionData = JSON.parse(localStorage.getItem('currentSession'));
  const hasSession = !!sessionData;
  const isAdmin = sessionData ? sessionData.isAdmin : false;

  const publicPages = ['/register', '/login'];
  const isPublicPage = publicPages.includes(to.path);
  const adminRoute = '/admin-certification';

  if (!hasSession) { 
    if (isPublicPage) {
      next();
    } else {
      next('/login');
    }
  } else {
    if (to.path === adminRoute && !isAdmin) {
      next('/'); 
    } else if ((to.path === '/register' || to.path === '/login') && hasSession) {
      if (isAdmin) {
        next('/admin-certification');
      } else {
        next('/');
      }
    } else {
      next();
    }
  }
});

export default router