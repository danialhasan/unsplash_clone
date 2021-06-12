<script>
export default {
  name: "Flash Message",
  data() {
    return {
      //   styleObject: {
      //     backgroundColor: this.$props.backgroundColor,
      //     accentColor: this.$props.accentColor,
      //     textColor: this.$props.textColor,
      //   },
    };
  },
  computed: {
    style() {
      return (
        this.backgroundColor + " " + this.accentColor + " " + this.textColor
      );
    },
  },
  props: {
    role: {
      type: String,
      default: "alert",
    },
    backgroundColor: {
      type: String,
      default: "bg-yellow-100",
    },
    accentColor: {
      type: String,
      default: "border-yellow-500",
    },
    textColor: {
      type: String,
      default: "text-yellow-700",
    },
    title: {
      type: String,
      default: "Warning",
    },
    description: {
      type: String,
      default: "This is a warning for you.",
    },
  },
};
</script>
<template>
  <div class="border-l-4 p-4" :class="style" :role="role">
    <p class="font-bold">{{ title }}</p>
    <p>{{ description }}</p>
  </div>
</template>