<script>
import axios from "axios";
import { LockClosedIcon } from "@heroicons/vue/solid";

export default {
  name: "Log in",
  data() {
    return {};
  },
  components: {
    LockClosedIcon,
  },
  methods: {
    interactWithState() {
      return this.$state.increase;
    },
    autofillForm() {
      // For dev purposes.
      let username = document.getElementById("email_input");
      let password = document.getElementById("password_input");
      username.value = "johnsmith14@gmail.com";
      password.value = "johnsmithisthecoolestmanalive";
    },
    submitLoginFormContents(e) {
      e.preventDefault();

      /**
       * It probably makes sense to store the username and
       * password in the vuex store, alongside the JWT.
       * 
       * I have to call a dispatch to the vuex store, passing in the email and 
       * password that have been put in the login form. Once I do that, I'll make
       * the API call to /login/verify, passing in the email and password. The server
       * will verify the details and if successful, generate a unique JWT key based on 
       * the details, the private key, and the randomness of the hashing algorithm. The server
       * will then send the JWT to the client where the store will receive it and put it in 
       * localStorage. I'll use that localstorage JWT key to verify my login status to the server 
       * every time I do something that involves my profile (liking pictures, adding them to collections, etc)
       * 
       * I'll also have logout functionality that deletes the JWT from the client and the server. First, 
       * it'll send a DELETE (not post, delete) request to the logout route. The request header needs to have
       * an authorization header of 'Bearer <JWT here>'. On the server, when it receives that request, it will
       * validate the request by verifying the JWT with the private key. To my understanding, it doesn't need to 
       * compare it to any username/password, since the JWT is uniquely generated when you log on; so, you can trust that when you
       * receive it, it hasn't been modified in any way since that would change it and it would fail the verify test.
       */

      let email = document.getElementById("email_input");
      let password = document.getElementById("password_input");

      console.log(`Email: ${email.value}, password:${password.value}`);
      axios
        .post("http://localhost:9000/users/login/verify", {
          email: email.value,
          password: password.value,
        })
        .then((res) => {
          console.log("Response:");
          console.log(res);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.autofillForm();
  },
  computed: {},
};
</script>
<template>
  <div
    class="
      min-h-full
      flex
      items-center
      justify-center
      bg-gray-50
      pt-36
      pb-12
      px-4
      sm:px-6
      lg:px-8
    "
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <img
          class="mx-auto h-12 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
          alt="Workflow"
        />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <form class="mt-8 space-y-6">
        <input type="hidden" name="remember" value="true" />
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email_input"
              name="email"
              type="email"
              autocomplete="email"
              required="true"
              class="
                appearance-none
                rounded-none
                relative
                block
                w-full
                px-3
                py-2
                border border-gray-300
                placeholder-gray-500
                text-gray-900
                rounded-t-md
                focus:outline-none
                focus:ring-indigo-500
                focus:border-indigo-500
                focus:z-10
                sm:text-sm
              "
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password_input"
              name="password"
              type="password"
              autocomplete="current-password"
              required=""
              class="
                appearance-none
                rounded-none
                relative
                block
                w-full
                px-3
                py-2
                border border-gray-300
                placeholder-gray-500
                text-gray-900
                rounded-b-md
                focus:outline-none
                focus:ring-indigo-500
                focus:border-indigo-500
                focus:z-10
                sm:text-sm
              "
              placeholder="Password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember_me"
              name="remember_me"
              type="checkbox"
              class="
                h-4
                w-4
                text-indigo-600
                focus:ring-indigo-500
                border-gray-300
                rounded
              "
            />
            <label for="remember_me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a
              href="#"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            @click="submitLoginFormContents"
            class="
              group
              relative
              w-full
              flex
              justify-center
              py-2
              px-4
              border border-transparent
              text-sm
              font-medium
              rounded-md
              text-white
              bg-indigo-600
              hover:bg-indigo-700
              focus:outline-none
              focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            "
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <LockClosedIcon
                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                aria-hidden="true"
              />
            </span>
            Sign in
          </button>
          <div class="w-full h-auto text-center py-4">
            <p class="italic text-sm">
              Don't have an account?
              <router-link
                :to="{ path: '/users/register' }"
                class="text-indigo-600"
                >Sign Up here.</router-link
              >
            </p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
