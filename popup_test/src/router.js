import { createWebHistory, createRouter } from 'vue-router'
import popup1 from './components/popup1.vue'
import popup2 from './components/popup2.vue'
import popup3 from './components/popup3.vue'
import popup4 from './components/popup4.vue'
import home from './components/home.vue'
const routes = [
  { path: '/', component: home },
  { path: '/popup1', component: popup1 },
  { path: '/popup2', component: popup2 },
  { path: '/popup3', component: popup3 },
  { path: '/popup4', component: popup4 },
]
export const router = createRouter({
  history: createWebHistory(),
  routes,
})