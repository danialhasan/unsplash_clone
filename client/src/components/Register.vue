<script>
import axios from "axios";
import FlashMessage from "@/components/FlashMessage.vue";
export default {
  name: "Register",
  data() {
    return {
      showFlashMessage: false,
      flashMessageData: {
        role: "success",
        backgroundColor: "bg-indigo-100",
        accentColor: "border-indigo-500",
        textColor: "text-indigo-700",
        title: "Success!",
        description: "This is a success message!",
      },
    };
  },
  methods: {
    autofillForm() {
      // For dev purposes.
      let name = document.getElementById("name_input");
      let email = document.getElementById("email_input");
      let username = document.getElementById("username_input");
      let password = document.getElementById("password_input");
      let verifyPassword = document.getElementById("verify_password_input");
      name.value = "John Smith";
      email.value = "johnsmith@gmail.com";
      username.value = "blackairforces1";
      password.value = "whoseeyesarethoseeyes";
      verifyPassword.value = "whoseeyesarethoseeyes";
    },
    deleteFlashMessage() {
      setTimeout(() => {
        this.showFlashMessage = false;
      }, 5000);
    },
    checkPasswords(p1, p2) {
      let regex = /^[A-Za-z0-9 ]+$/;
      if (!(p1 == p2)) {
        console.error(`Passwords do not match: ${p1} != ${p2}`);
        this.flashMessageData = {
          role: "alert",
          backgroundColor: "bg-red-100",
          accentColor: "border-red-500",
          textColor: "text-red-700",
          title: "Password verification failed",
          description: "Your passwords did not match.",
        };
        this.showFlashMessage = true;
        this.deleteFlashMessage();
        return false;
      } else if (p1.length < 8 || !regex.test(p1)) {
        console.error("Password does not meet the complexity requirements.");
        this.flashMessageData = {
          role: "alert",
          backgroundColor: "bg-red-100",
          accentColor: "border-red-500",
          textColor: "text-red-700",
          title: "Password too simple",
          description:
            "Your password is too simple. Pick a password with uppercase and lowercase characters, as well as numbers. No special characters.",
        };
        this.showFlashMessage = true;
        setTimeout(() => {
          this.showFlashMessage = false;
        }, 5000);
        return false;
      } else {
        console.log("Passwords are good");
        return true;
      }
    },
    async submitRegisterFormContents() {
      let name = document.getElementById("name_input");
      let email = document.getElementById("email_input");
      let username = document.getElementById("username_input");
      let password = document.getElementById("password_input");
      let verifyPassword = document.getElementById("verify_password_input");

      if (!this.checkPasswords(password.value, verifyPassword.value)) {
        throw new Error();
      }
      try {
        //
        this.$store
          .dispatch("registerAccount", {
            name: name.value,
            email: email.value,
            username: username.value,
            password: password.value,
            verifyPassword: verifyPassword.value,
          })
          .then((res) => {
            console.log("Response:");
            console.log(res);
            switch (res.status) {
              case 210:
                console.log("Account created by server!");
                this.flashMessageData = {
                  role: "success",
                  backgroundColor: "bg-green-100",
                  accentColor: "border-green-500",
                  textColor: "text-green-700",
                  title: "Success!",
                  description:
                    "Your account was created successfully. You can log in now!",
                };
                this.showFlashMessage = true;
                this.deleteFlashMessage();
                break;
              case 211:
                console.log("Passwords did not match.");
                this.flashMessageData = {
                  role: "alert",
                  backgroundColor: "bg-red-100",
                  accentColor: "border-red-500",
                  textColor: "text-red-700",
                  title: "Password verification failed",
                  description: "Your passwords did not match.",
                };
                this.showFlashMessage = true;
                this.deleteFlashMessage();
                break;
              case 212:
                console.log("Username was not available.");
                this.flashMessageData = {
                  role: "alert",
                  backgroundColor: "bg-red-100",
                  accentColor: "border-red-500",
                  textColor: "text-red-700",
                  title: "Username is already taken",
                  description:
                    "The username you picked was already taken. Please pick another one.",
                };
                this.showFlashMessage = true;
                this.deleteFlashMessage();
                break;
              case 213:
                console.log(
                  "The email used for registration is already registered to an account. If this is you, please log in with your password."
                );
                this.flashMessageData = {
                  role: "alert",
                  backgroundColor: "bg-red-100",
                  accentColor: "border-red-500",
                  textColor: "text-red-700",
                  title: "Email already exists",
                  description:
                    "The email used for registration is already registered to an account. If this is you, please log in with your password.",
                };
                this.showFlashMessage = true;
                this.deleteFlashMessage();
                break;

              default:
                break;
            }
          })
          .catch((error) => {
            console.error(error);
          });
        //
      } catch (error) {}
    },
    preventSpaces(key) {
      if (key.keyCode == 32) {
        return false;
      }
    },
  },
  components: {
    FlashMessage,
  },
  mounted() {
    this.autofillForm();
  },
};
</script>
<template>
  <div class="min-h-full pt-24 flex flex-col">
    <div
      class="
        container
        max-w-sm
        mx-auto
        flex-1 flex flex-col
        items-center
        justify-center
        px-2
      "
    >
      <form
        onsubmit="return false"
        method="POST"
        action="#"
        class="bg-white px-6 py-8 rounded shadow-md text-black w-full"
      >
        <h1 class="mb-8 text-3xl font-extrabold text-center">
          Create your account
        </h1>
        <input
          id="name_input"
          type="text"
          class="block border border-gray-200 w-full p-3 rounded mb-4"
          name="fullname"
          placeholder="Full Name"
          required="true"
        />

        <input
          id="email_input"
          type="text"
          class="block border border-gray-200 w-full p-3 rounded mb-4"
          name="email"
          placeholder="Email"
        />
        <input
          id="username_input"
          type="text"
          class="block border border-gray-200 w-full p-3 rounded mb-4"
          name="username"
          placeholder="Username"
          :onkeydown="this.preventSpaces"
        />

        <input
          id="password_input"
          type="password"
          class="block border border-gray-200 w-full p-3 rounded mb-4"
          name="password"
          placeholder="Password"
        />
        <input
          id="verify_password_input"
          type="password"
          class="block border border-gray-200 w-full p-3 rounded mb-4"
          name="confirm_password"
          placeholder="Confirm Password"
        />

        <button
          type="submit"
          @click="this.submitRegisterFormContents()"
          class="
            w-full
            text-center
            py-3
            rounded
            bg-indigo-500
            text-white
            hover:bg-indigo-600
            focus:outline-none
            my-1
          "
        >
          Create Account
        </button>
      </form>

      <div class="text-gray-800 mt-6">
        Already have an account?
        <router-link
          class="no-underline border-b border-blue text-indigo-500"
          :to="{ path: '/users/' }"
        >
          Log in </router-link
        >.
      </div>
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