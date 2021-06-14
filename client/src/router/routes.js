import Home from '@/views/Home.vue'
import NotFound from '@/views/NotFound.vue'
import Users from '@/views/Users.vue'
import Login from '@/components/LogIn.vue'
import LogOut from '@/components/LogOut.vue'
import Register from '@/components/Register.vue'
import Profile from '@/views/Profile.vue'

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [{
    path: '/',
    component: Home,
    name: "Home"
  },
  {
    name: "Users",
    path: "/users",
    component: Users,
    children: [{
        name: "Login",
        path: "",
        component: Login,
        meta: {
          requiresVisitor: true
        }
      },
      {
        name: "Register",
        path: "register",
        component: Register,
        meta: {
          requiresVisitor: true
        }
      },
      {
        name: "Logout",
        path: "/logout",
        component: LogOut
      }
    ]
  },
  {
    name: "Profile",
    path: "/profile",
    component: Profile,
    meta: {
      requiresAuth: true
    }
  },
  {
    name: "NotFound",
    path: '/:path(.*)',
    component: NotFound
  },
]