<script>
export default {
  created() {
    this.$store
      .dispatch("destroyToken")
      .then((res) => {
        this.$router.push("/");
      })
      .catch((err) => {
        this.$router.push("/");
      });
  },
};
</script>
<template></template>