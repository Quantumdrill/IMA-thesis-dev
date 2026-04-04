import { createWebHistory, createRouter } from 'vue-router'
import startPage from "./components/startPage.vue"
import stage1 from "./components/stage1.vue"
import stage21 from "./components/stage21.vue"
import stage22 from "./components/stage22.vue"
import stage23 from "./components/stage23.vue"
import stage24 from "./components/stage24.vue"
import stage31 from "./components/stage31.vue"
import stage32 from "./components/stage32.vue"
import stage33 from "./components/stage33.vue"
import stage4 from "./components/stage4.vue"
import stage5 from "./components/stage5.vue"
import stage6 from "./components/stage6.vue"
import stage7 from "./components/stage7.vue"
import stage81 from "./components/stage81.vue"
import stage82 from "./components/stage82.vue"
import stage83 from "./components/stage83.vue"
import stage9 from "./components/stage9.vue"
import endPage from "./components/endPage.vue"
import popupSquare from "./components/popupSquare.vue"

const routes = [
  { path: "/", component: startPage },
  { path: "/stage1", component: stage1 },
  { path: "/stage21", component: stage21 },
  { path: "/stage22", component: stage22 },
  { path: "/stage23", component: stage23 },
  { path: "/popupSquare/:index", component: popupSquare },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})