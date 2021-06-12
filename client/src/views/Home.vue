<script>
//import packages
import axios from "axios";
// import components

export default {
  components: {},
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
  <h1 class="text-3xl font-bold text-black text-center py-20">
    This is the homepage.
  </h1>
</template>