<script>
import Login from "@/components/LogIn.vue";
import Register from "@/components/Register.vue";

export default {
  name: "Users",
  data() {
    return {};
  },
  components: {
    Login,
    Register,
  },
};
</script>
<template>
  <div class="bg-gray-50">
    <router-view />
  </div>
</template>