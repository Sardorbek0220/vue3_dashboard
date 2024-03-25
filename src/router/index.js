import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/', 
      redirect: to => {
        return { path: '/dashboard' }
      }
    },
    {
      path: '/',
      component: () => import('../layouts/default.vue'),
      children: [
        {
          path: 'dashboard',
          component: () => import('../pages/dashboard.vue'),
        },
        {
          path: 'domains',
          component: () => import('../pages/domains.vue'),
        },
        {
          path: 'report/sale',
          component: () => import('../pages/reports/sale.vue'),
        }
      ],
    },
    {
      path: '/',
      component: () => import('../layouts/blank.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../pages/login.vue'),
        },
      ],
    },
  ],
})

router.beforeEach(({ name }, from, next) => {
  if (name === 'login' && localStorage.getItem("manager_user")) {
    next("/dashboard");
  }
  if (name === 'login' || localStorage.getItem("manager_user")) {
    return next();
  }
  next("/login");
});

export default router

