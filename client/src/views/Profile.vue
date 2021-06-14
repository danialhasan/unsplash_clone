<script>
export default {
  data() {
    return {
      loading: null,
      profile: {
        name: null,
        username: null,
        email: null,
        bio: null,
      },
    };
  },
  mounted() {
    if (this.profile.name == null) {
      // either user has refreshed the page and vuex store is empty
      // or user was automatically logged in (with token) and
      // redirected to /profile.
      this.loading = true;
      let localStorageEmail = localStorage.getItem("email");

      this.$store
        .dispatch("setProfile", { email: localStorageEmail })
        .then((res) => {
          console.log(
            "setProfile action was successful. Profile should match vuex store profile, which should be full."
          );
          // FIXME this code is running before the code in setProfile! That's the cause of the error!
          console.log("Profile:");
          console.log(this.$store.getters.getProfile);
          this.profile = this.$store.getters.getProfile;
          return;
        })
        .catch((error) => {
          console.error("setProfile action was not successful");
          throw error;
        });
    }
  },
};
</script>
<template>
  <h1 class="font-bold my-24 text-center text-3xl">
    Welcome, <span id="name">{{ this.profile.name }}</span>
  </h1>
</template>