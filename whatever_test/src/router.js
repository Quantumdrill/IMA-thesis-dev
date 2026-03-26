import { createWebHistory, createRouter } from 'vue-router'
import startPage from "./components/startPage.vue"

const routes = [
  { path: '/', component: startPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})