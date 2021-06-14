<script>
import LogOut from "./LogOut.vue";
export default {
  components: { LogOut },
  name: "Navbar",
  data() {
    return {};
  },
  methods: {
    searchImages() {
      const input = document.getElementById("imageInput");
      console.log(input.value);
      input.value = null;
    },
    toggleMenu() {
      const menu = document.getElementById("mobileMenu");
      menu.classList.toggle("hidden");
      menu.classList.toggle("flex");
    },
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
  },
};
</script>
<template>
  <div class="w-full h-20 bg-gray-50 border-2 border-black p-4">
    <div
      class="
        flex flex-row flex-nowrap
        justify-between
        w-full
        items-center
        h-full
      "
    >
      <div class="w-12 h-full flex-none bg-no-repeat border-2 border-black">
        <router-link to="/">
          <img
            src="/icons/logo.svg"
            alt="logo icon"
            class="w-full h-full"
            srcset=""
        /></router-link>
      </div>
      <div
        class="
          flex-grow flex flex-row
          h-full
          mx-4
          bg-gray-100
          border-2 border-black
        "
      >
        <input
          type="text"
          id="imageInput"
          class="w-full h-full border-none bg-gray-100"
        />
        <img
          src="/icons/search.svg"
          @click="searchImages"
          class="w-auto h-full"
          alt=""
          srcset=""
        />
      </div>
      <div class="flex-none hidden ml-4 md:block">
        <ul class="flex flex-row space-x-8">
          <li v-if="!loggedIn">
            <router-link :to="{ path: '/users' }">Sign in</router-link>
          </li>
          <li v-if="!loggedIn">
            <router-link :to="{ path: '/users/register' }">Sign up</router-link>
          </li>
          <li v-if="loggedIn">
            <router-link to="/profile">Profile</router-link>
          </li>
          <li v-if="loggedIn">
            <router-link :to="{ name: 'Logout' }">Log Out</router-link>
          </li>
        </ul>
      </div>
      <div class="w-12 h-full flex-none md:hidden" @click="toggleMenu">
        <img
          src="/icons/menu.svg"
          alt="logo icon"
          class="z-50 w-full h-full"
          srcset=""
        />
      </div>
    </div>
    <div
      id="mobileMenu"
      class="
        z-10
        absolute
        hidden
        top-0
        left-0
        flex-col
        items-center
        justify-center
        w-full
        h-full
        bg-black
        opacity-90
      "
      @click="toggleMenu"
    >
      <ul
        class="
          font-normal
          text-3xl text-center text-white
          flex flex-col
          space-y-12
        "
      >
        <li v-if="!loggedIn">
          <router-link :to="{ path: '/users' }">Sign in</router-link>
        </li>
        <li v-if="!loggedIn">
          <router-link :to="{ path: '/users/register' }">Sign up</router-link>
        </li>
        <li v-if="loggedIn">
          <router-link to="/profile">Profile</router-link>
        </li>
        <li v-if="loggedIn">
          <router-link :to="{ name: 'Logout' }">Log Out</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>