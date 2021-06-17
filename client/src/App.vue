<script>
import Navbar from "@/components/Navbar.vue";

export default {
  components: {
    Navbar,
  },
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <navbar />
    <main>
      <router-view />
    </main>
  </div>
</template>
