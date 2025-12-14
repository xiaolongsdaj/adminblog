import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/index.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('../components/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/Dashboard/index.vue')
      },
      {
        path: 'articles',
        name: 'Articles',
        component: () => import('../views/Articles/index.vue')
      },
      {
        path: 'articles/edit/:id?',
        name: 'ArticleEdit',
        component: () => import('../views/Articles/edit.vue')
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('../views/Categories/index.vue')
      },
      {
        path: 'categories/edit/:id?',
        name: 'CategoryEdit',
        component: () => import('../views/Categories/edit.vue')
      },
      {
        path: 'tags',
        name: 'Tags',
        component: () => import('../views/Tags/index.vue')
      },
      {
        path: 'comments',
        name: 'Comments',
        component: () => import('../views/Comments/index.vue')
      },
      {
        path: 'comments/edit/:id',
        name: 'CommentEdit',
        component: () => import('../views/Comments/edit.vue')
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/Users/index.vue')
      },
      {
        path: 'users/edit/:id?',
        name: 'UserEdit',
        component: () => import('../views/Users/edit.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/Settings/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router