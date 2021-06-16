<script>
export default {
  name: "UserLikes",
  data() {
    return {};
  },
  props: ["image"],
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
    <img
      class="w-full"
      :src="`data:image/jpg;base64,${this.image}`"
      alt="Post"
      srcset="
        data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkBAMAAACCzIhnAAAAG1BMVEXMzMyWlpacnJy+vr6jo6PFxcW3t7eqqqqxsbHbm8QuAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAiklEQVRYhe3QMQ6EIBAF0C+GSInF9mYTs+1ewRsQbmBlayysKefYO2asXbbYxvxHQj6ECQMAEREREf2NQ/fCtp5Zky6vtRMkSJEzhyISynWJnzH6Z8oQlzS7lEc/fLmmQUSvc16OrCPqRl1JePxQYo1ZSWVj9nxrrOb5esw+eXdvzTWfTERERHRXH4tWFZGswQ2yAAAAAElFTkSuQmCC
      "
    />
  </div>
</template>