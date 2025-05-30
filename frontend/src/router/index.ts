import { createRouter, createWebHistory } from 'vue-router'
import ReplayView from '../views/ReplayView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: ReplayView }
  ]
})

export default router