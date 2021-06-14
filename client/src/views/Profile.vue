<script>
export default {
  data() {
    return {
      profile: this.$store.getters.getProfile,
    };
  },
  methods: {},
};
</script>
<template>
  <h1 class="font-bold my-24 text-center text-3xl">
    Welcome, <span id="name">{{ this.profile.name }}</span>
  </h1>
</template>