<script>
export default {
  name: "BottomNav",
  data() {
    return {};
  },
  props: [],
  methods: {
    postImage() {
      this.$store
        .dispatch("postImage")
        .then((result) => {
          return;
        })
        .catch((err) => {
          return;
        });
    },
  },
};
</script>
<template>
  <div class="w-full h-auto flex flex-row">
    <div class="p-4 border flex-grow border-red-400">
      <!-- 
    In the future, clicking this button will navigate to a guarded route where the user 
    can pick pictures from their camera roll to post them. Right now, I'm just testing out the server routes. 
 -->
      <span>
        <img
          src="/icons/logo.svg"
          alt="logo icon"
          class="w-12 h-12 text-center mx-auto"
          @click="postImage"
        />
      </span>
    </div>
    <div class="p-4 border flex-grow border-red-400">
      <span class="text-center text-bold">Test</span>
    </div>
    <div class="p-4 border flex-grow border-red-400">
      <span class="text-center text-bold">Test</span>
    </div>
  </div>
</template>