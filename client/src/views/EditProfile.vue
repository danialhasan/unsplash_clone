<script>
export default {
  data() {
    return {
      profile: {
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
  methods: {
    deleteFlashMessage() {
      setTimeout(() => {
        this.showFlashMessage = false;
      }, 5000);
    },
    saveChanges() {
      let profile = this.profile;
      this.$store.dispatch("updateProfile", { profile });
    },
    cancelChanges(){
        // cancel changes and go to profile. 
    }
  },
  created() {
    //   get profile, set this.profile to that profile.
    // this makes the editedProfile initially the same as the unedited profile.
    // this helps prevent
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
            v-model="this.profile.name"
            class="bg-gray-200 rounded-lg"
            placeholder="name here"
          />
        </div>
        <div class="flex w-[310px] flex-row justify-between items-center">
          <label for="email" class="text-lg font-bold">Email</label>
          <input
            type="text"
            name="email"
            v-model="this.profile.email"
            class="bg-gray-200 rounded-lg"
            placeholder="email here"
          />
        </div>
        <div class="flex w-[310px] flex-row justify-between items-center">
          <label for="username" class="text-lg font-bold">Username</label>
          <input
            type="text"
            name="username"
            v-model="this.profile.username"
            class="bg-gray-200 rounded-lg"
            placeholder="username here"
          />
        </div>
        <div class="flex w-[310px] flex-row justify-between items-center">
          <label for="for" class="text-lg font-bold">Bio</label>
          <textarea
            type="text"
            name="bio"
            v-model="this.profile.bio"
            class="bg-gray-200 rounded-lg"
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