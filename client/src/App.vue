<script>
import Navbar from "@/components/Navbar.vue";

export default {
  components: {
    Navbar,
  },
};
</script>

<template>
  <div>
    <navbar />
    <main>
      <router-view />
    </main>
  </div>
</template>
