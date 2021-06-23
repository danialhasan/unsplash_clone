<script>
import FlashMessage from "@/components/FlashMessage.vue";

export default {
  data() {
    return {
      editedProfile: {
        name: null,
        username: null,
        bio: null,
        email: null,
      },
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
  props: [],
  components: { FlashMessage },
  methods: {
    deleteFlashMessage() {
      setTimeout(() => {
        this.showFlashMessage = false;
      }, 5000);
    },
    saveChanges() {
      let profile = this.editedProfile; // save profile to this method
      this.$store
        .dispatch("updateProfile", {
          profile,
          oldEmail: localStorage.getItem("email"),
          oldUsername: this.$store.state.profile.username,
        })
        .then((res) => {
          console.log(res); // return successful flash message
          switch (res.status) {
            case 218:
              console.log("Email is taken in database.");
              this.flashMessageData = {
                role: "alert",
                backgroundColor: "bg-red-100",
                accentColor: "border-red-500",
                textColor: "text-red-700",
                title: res.data,
                description:
                  "The new email you chose has already been registered to another account. Please choose another email address, or log into that account.",
              };
              this.showFlashMessage = true;
              this.deleteFlashMessage();
              break;
            case 219:
              console.log("Username is taken in database.");
              this.flashMessageData = {
                role: "alert",
                backgroundColor: "bg-red-100",
                accentColor: "border-red-500",
                textColor: "text-red-700",
                title: res.data,
                description:
                  "The new username you chose has already been registered to another account. Please choose another username, or log into that account.",
              };
              this.showFlashMessage = true;
              this.deleteFlashMessage();
              break;
            case 220:
              console.log("Change was successful.");
              console.log(res);
              localStorage.setItem("email", res.data.email);
              this.flashMessageData = {
                role: "success",
                backgroundColor: "bg-green-100",
                accentColor: "border-green-500",
                textColor: "text-green-700",
                title: res.statusText,
                description: "Account settings saved successfully.",
              };
              this.showFlashMessage = true;
              this.deleteFlashMessage();
              break;
            default:
              console.log("status code received was not 218/219/220.");
              break;
          }
        })
        .catch((error) => {
          console.error(error); // return error flash message
          throw error;
        });
    },
    cancelChanges() {
      // cancel changes and go to profile.
    },
  },
  mounted() {
    console.log("MOUNTED");
    // hydrate vuex store with data is it isn't already.
    if (this.$store.getters.getProfile.username == null) {
      let email = localStorage.getItem("email");
      this.$store
        .dispatch("setProfile", { email })
        .then((res) => {
          this.editedProfile.username = res.username;
          this.editedProfile.name = res.name;
          this.editedProfile.bio = res.bio;
          this.editedProfile.email = res.email;
        })
        .catch((error) => {
          console.error(error);
          this.flashMessageData = {
            role: "alert",
            backgroundColor: "bg-red-100",
            accentColor: "border-red-500",
            textColor: "text-red-700",
            title: "Unable to get profile data",
            description:
              "We were unable to get the data for your profile. Please refresh the page, try again later, or navigate to this page from the profile page.",
          };
          this.showFlashMessage = true;
          this.deleteFlashMessage();
        });
    } else {
      let profile = this.$store.getters.getProfile;
      this.editedProfile.name = profile.name;
      this.editedProfile.email = profile.email;
      this.editedProfile.bio = profile.bio;
      this.editedProfile.username = profile.username;
    }
  },
};
</script>
<template>
  <div class="w-full h-auto bg-gray-50">
    <div
      id="edit_profile_form_container"
      class="w-full max-w-[500px] pt-12 h-auto"
    >
      <form
        v-on:submit.prevent
        class="w-full flex flex-col space-y-7 items-center"
      >
        <div class="flex w-[310px] flex-row justify-between items-center">
          <label for="name" class="text-lg font-bold">Name</label>
          <input
            type="text"
            name="name"
            v-model="this.editedProfile.name"
            class="bg-gray-200 rounded-lg"
            placeholder="name here"
          />
        </div>
        <div class="flex w-[310px] flex-row justify-between items-center">
          <label for="email" class="text-lg font-bold">Email</label>
          <input
            type="text"
            name="email"
            v-model="this.editedProfile.email"
            class="bg-gray-200 rounded-lg"
            placeholder="email here"
          />
        </div>
        <div class="flex w-[310px] flex-row justify-between items-center">
          <label for="username" class="text-lg font-bold">Username</label>
          <input
            type="text"
            name="username"
            v-model="this.editedProfile.username"
            class="bg-gray-200 rounded-lg"
            placeholder="username here"
          />
        </div>
        <div class="flex w-[310px] flex-row justify-between items-top">
          <label for="for" class="text-lg font-bold">Bio</label>
          <textarea
            type="text"
            name="bio"
            v-model="this.editedProfile.bio"
            class="bg-gray-200 rounded-lg min-h-[100px]"
            placeholder="Bio here"
          ></textarea>
        </div>
        <div class="w-full h-auto flex flex-row space-x-4 justify-center">
          <button
            class="px-6 py-3 font-bold bg-green-500 text-white rounded-xl"
            @click="saveChanges()"
          >
            Save changes
          </button>
          <button class="font-normal text-gray-700" @click="cancelChanges()">
            Cancel
          </button>
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