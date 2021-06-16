<script>
import axios from "axios";
import { LockClosedIcon } from "@heroicons/vue/solid";
import FlashMessage from "@/components/FlashMessage.vue";

export default {
  name: "Log in",
  data() {
    return {
      loading: false,
      email: "",
      password: "",
      showFlashMessage: false,
      flashMessageData: {
        role: "success",
        backgroundColor: "bg-indigo-100",
        accentColor: "border-indigo-500",
        textColor: "text-indigo-700",
        title: "Success!",
        description: "This is a success message!",
      },
      profile: this.$store.state.profile,
    };
  },
  components: {
    LockClosedIcon,
    FlashMessage,
  },
  methods: {
    setLoadingIcon(element) {
      console.log(element);
    },
    interactWithState() {
      return this.$state.increase;
    },
    deleteFlashMessage() {
      setTimeout(() => {
        this.showFlashMessage = false;
      }, 5000);
    },
    autofillForm() {
      // For dev purposes.
      this.email = "johnsmith@gmail.com";
      this.password = "whoseeyesarethoseeyes";
    },
    submitLoginFormContents(e) {
      e.preventDefault();

      // set loading animation
      this.loading = true;

      console.log(`Email: ${this.email}, password:${this.password}`);
      let email = this.email.toLowerCase();
      let password = this.password;
      let credentials = {
        email,
        password,
      };
      //calling retrieveToken action to vueX store with credentials as payload
      this.$store
        .dispatch("retrieveToken", credentials)
        .then((res) => {
          this.loading = true;
          // if user is able to log in, get their profile info
          // from the database and save it to the store. Updates to it shall be
          // done through the store, and on every update, the new info will be pushed
          // to the database to update it.

          this.$store
            .dispatch("setProfile", { email })
            .then((res) => {
              // if (!res) return;
              console.log("setProfile action was successful");
              console.log("Profile:");
              console.log(this.$store.getters.getProfile);
              localStorage.setItem("email", email);
              console.log(
                `Email saved to localstorage: ${localStorage.getItem("email")}`
              );
              this.$router.push({ name: "Profile" });
              console.log("Profile router pushed");
              return;
            })
            .catch((error) => {
              console.error("setProfile action was not successful");
              throw error;
            });
        })
        .catch((error) => {
          console.log(error);
          // switch case to take action depending on type of error receives
          switch (error.statusCode) {
            case 215:
              console.log("Incorrect Password (flash message)");
              this.flashMessageData = {
                role: "alert",
                backgroundColor: "bg-red-100",
                accentColor: "border-red-500",
                textColor: "text-red-700",
                title: "Password verification failed",
                description: "Your password was incorrect. Please try again.",
              };
              this.showFlashMessage = true;
              this.deleteFlashMessage();
              break;
            case 216:
              console.log("Email was not found in database (flash message)");
              this.flashMessageData = {
                role: "alert",
                backgroundColor: "bg-red-100",
                accentColor: "border-red-500",
                textColor: "text-red-700",
                title: "Account not found",
                description:
                  "We did not find an account with your email in our database. Please try again.",
              };
              this.showFlashMessage = true;
              this.deleteFlashMessage();
            default:
              break;
          }
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
              v-model="email"
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
              v-model="password"
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

        <div>
          <button
            type="submit"
            id="login_form_submit_btn"
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
            <span v-if="loading" id="loading_icon">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path></svg
            ></span>
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
    <div
      id="flash_message_container"
      class="fixed right-0 bottom-0 w-full h-auto"
    >
      <flash-message
        @click="this.showFlashMessage = !this.showFlashMessage"
        v-bind="this.flashMessageData"
        v-if="this.showFlashMessage"
      />
    </div>
  </div>
</template>
