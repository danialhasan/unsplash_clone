<script>
export default {
  name: "SettingsModal",
  data() {
    return {};
  },
  props: [],
  methods: {},
  emits: ["settingsCancelled"],
};
</script>
<template>
  <div
    class="
      z-50
      rounded-2xl
      border border-gray-700
      bg-gray-50
      min-w-[250px]
      h-auto
    "
  >
    <ul class="flex flex-col text-sm text-center">
      <li class="w-full py-3 border-b border-gray-300">
        <router-link :to="{ name: 'EditProfile' }"> Edit profile </router-link>
      </li>
      <!-- <li class="w-full py-3 border-b border-gray-300">Setting item 4</li> -->
      <li
        class="w-full py-3 border-b rounded-2xl border-gray-300"
        @click="this.$emit('settingsCancelled')"
      >
        Cancel
      </li>
    </ul>
  </div>
</template>