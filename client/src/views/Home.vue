<script>
//import packages
import axios from "axios";
// import components
import BottomNav from "@/components/BottomNav.vue";

export default {
  components: {
    BottomNav,
  },
  data() {
    return {};
  },
  methods: {
    sendServerRequest() {
      const serverURL = "http://localhost:9000/api/test";
      axios.get(serverURL).then((response) => {
        console.log(response);
      });
    },
  },
};
</script>

<template>
  <div class="min-h-full">
    <h1 class="text-3xl font-bold text-black text-center py-20">
      This is the homepage.
    </h1>
    <div class="absolute bottom-0 border w-full">
      <bottom-nav />
    </div>
  </div>
</template>