<script>
export default {
  name: "UserPosts",
  data() {
    return {};
  },
  props: ["posts"],
  /**
   * For some reason, passing a string to the image prop gives a typeError when image
   * is laid out like this. 
   *   image: {
      // base64, since we'll be getting the image passed down from the database.
      type: String,
      default: "TestImageDefaultText",
    },
   */
};
</script>
<template>
  <div class="w-full h-auto border border-red-400">
    <h1 class="font-bold text-3xl text-center">
      This is the userposts component.
    </h1>
  </div>
</template>