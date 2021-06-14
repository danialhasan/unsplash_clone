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
import store from '@/store/store.js'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters.loggedIn) {
      next({
        name: 'Login',
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresVisitor)) {
    if (store.getters.loggedIn) {
      next({
        name: "Home"
      }) // make sure to always call next()!
    } else {
      next()
    }
  } else {
    next()
  }
})

app.use(store)
app.use(router)
app.mount('#app')