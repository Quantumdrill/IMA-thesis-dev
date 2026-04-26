import { createWebHistory, createRouter } from 'vue-router'
import startPage from "./components/stages/startPage.vue"
import stage1 from "./components/stages/stage1.vue"
import stage21 from "./components/stages/stage21.vue"
import stage22 from "./components/stages/stage22.vue"
import stage23 from "./components/stages/stage23.vue"
import stage24 from "./components/stages/stage24.vue"
import stage31 from "./components/stages/stage31.vue"
import stage32 from "./components/stages/stage32.vue"
import stage33 from "./components/stages/stage33.vue"
import stage4 from "./components/stages/stage4.vue"
import stage5 from "./components/stages/stage5.vue"
import stage6 from "./components/stages/stage6.vue"
import stage7 from "./components/stages/stage7.vue"
import stage81 from "./components/stages/stage81.vue"
import stage82 from "./components/stages/stage82.vue"
import stage83 from "./components/stages/stage83.vue"
import stage9 from "./components/stages/stage9.vue"
import endPage from "./components/stages/endPage.vue"
import popups from "./components/global/popups.vue"
import popupsSubmarine from "./components/global/popupsSubmarine.vue"
import Naoto from "./components/character/Naoto.vue"

const routes = [
  { path: "/", component: startPage },
  { path: "/startPage", component: startPage },
  { path: "/stage1", component: stage1 },
  { path: "/stage21", component: stage21 },
  { path: "/stage22", component: stage22 },
  { path: "/stage23", component: stage23 },
  { path: "/stage24", component: stage24 },
  { path: "/stage31", component: stage31 },
  { path: "/stage32", component: stage32 },
  { path: "/stage33", component: stage33 },
  { path: "/stage4", component: stage4 },
  { path: "/stage5", component: stage5 },
  { path: "/stage6", component: stage6 },
  { path: "/stage7", component: stage7 },
  { path: "/stage81", component: stage81 },
  { path: "/stage82", component: stage82 },
  { path: "/stage83", component: stage83 },
  { path: "/stage9", component: stage9 },
  { path: "/endPage", component: endPage },
  { path: "/popups/:id", component: popups },
  { path: "/popupsSubmarine/:id", component: popupsSubmarine },
  { path: "/charTest", component: Naoto },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})