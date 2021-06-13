import {
  createApp
} from 'vue'
import './tailwind.css'
import App from './App.vue'
import {
  routes
} from './router/routes.js'
import {
  createRouter,
  createWebHistory
} from 'vue-router'
import store from '@/store/index.js'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes,
})
app.use(router)
app.use(store)
app.mount('#app')