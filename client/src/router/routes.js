import Home from '@/views/Home.vue'
import NotFound from '@/views/NotFound.vue'
import Users from '@/views/Users.vue'
import Login from '@/components/LogIn.vue'
import Register from '@/components/Register.vue'

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [{
    path: '/',
    component: Home,

  },
  {
    name: "Users",
    path: "/users",
    component: Users,
    children: [{
        name: "Login",
        path: "",
        component: Login
      },
      {
        name: "Register",
        path: "register",
        component: Register
      }
    ]
  },
  {
    path: '/:path(.*)',
    component: NotFound
  },
]