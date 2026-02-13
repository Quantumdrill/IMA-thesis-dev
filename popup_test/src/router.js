import { createWebHistory, createRouter } from 'vue-router'
import popup1 from './components/popup1.vue'
import popup2 from './components/popup2.vue'
import home from './components/home.vue'
const routes = [
  { path: '/', component: home },
  { path: '/popup1', component: popup1 },
  { path: '/popup2', component: popup2 },
]
export const router = createRouter({
  history: createWebHistory(),
  routes,
})