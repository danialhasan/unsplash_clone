<script>
import { v4 as uuidv4 } from "uuid";

import BottomNav from "@/components/BottomNav.vue";
import FlashMessage from "../components/FlashMessage.vue";

export default {
  name: "PostImage",
  data() {
    return {
      showFlashMessage: false,
      flashMessageData: {
        role: "success",
        backgroundColor: "bg-indigo-100",
        accentColor: "border-indigo-500",
        textColor: "text-indigo-700",
        title: "Success!",
        description: "This is a success message!",
      },
      loading: false,
    };
  },
  props: [],
  methods: {
    deleteFlashMessage() {
      setTimeout(() => {
        this.showFlashMessage = false;
      }, 5000);
    },
    async getImageLabels() {
      /**
       * STEPS
       * 1. User uploads image to component, this.loading=true
       *    1.1: flash message displays indigo "Looking at your image..."
       * 2. Image is converted to base64 and dispatched to postImage action as argument
       * 3. When label is returned, it is displayed on the bottom of the page.
       *    3.1: flash message displays indigo "Uploading your image..."
       * 4. Image object is created with image as base64, alongside array of labels/tags.
       * 5. Image object is pushed to mongodb database, into the posts collection.
       *    5.1: flash message displays green "Image uploaded!..."
       * 6. this.loading = false
       */
    },
    async postImage(image) {
      const uuid = uuidv4();
      this.loading = true;
      console.log("uploadImage called");
      this.showFlashMessage = true;
      this.flashMessageData = {
        role: "info",
        backgroundColor: "bg-blue-100",
        accentColor: "border-blue-500",
        textColor: "text-blue-700",
        title: "Your image is being uploaded",
        description: "Your image is being processed by our robots...",
      };
      this.deleteFlashMessage();
      this.$store
        .dispatch("postImage", {
          image,
          uuid,
        }) //$store.dispatch only takes one argument
        .then((result) => {
          console.log(result);
          this.showFlashMessage = true;
          this.flashMessageData = {
            role: "success",
            backgroundColor: "bg-green-100",
            accentColor: "border-green-500",
            textColor: "text-green-700",
            title: "Success!",
            description: "Rekognition labels received!",
          };
          this.deleteFlashMessage();
          this.loading = false;
          return;
        })
        .catch((err) => {
          console.error("postImage action was not successful");
          this.showFlashMessage = true;
          this.flashMessageData = {
            role: "alert",
            backgroundColor: "bg-red-100",
            accentColor: "border-red-500",
            textColor: "text-red-700",
            title: "Your image couldn't be posted",
            description:
              "Please check your internet connection and try again later. ",
          };
          this.deleteFlashMessage();
          this.loading = false;
          return;
        });
    },
    async uploadImage() {
      this.loading = true;
      /**
       * Get file from filesystem.
       * Send to server.
       * In server, get labels. If that works, push to database as object with image and labels. Send success message + labels or error message to client.
       * In client, display relevant flash message for error/success. Display labels if successful.
       *  If server returned a successful request, dispatch the getProfile action.
       */
      let input = document.createElement("input");

      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/png,image/jpg,image/jpeg");
      input.setAttribute("id", "file_input");

      input.click();

      input.addEventListener("change", () => {
        let imageSize = input.files[0].size;
        console.log(`File size: ${imageSize / 1e6}MB`);
        if (imageSize > 5e6) {
          // the image chosen by the user is too big
          console.error("Image file is too big!");
          console.error(`File size: ${imageSize / 1e6}MB`);
          console.error(`Maximum File size: 20MB`);
          this.showFlashMessage = true;
          this.flashMessageData = {
            role: "alert",
            backgroundColor: "bg-red-100",
            accentColor: "border-red-500",
            textColor: "text-red-700",
            title: "Your file is too big.",
            description: "Please choose a smaller file to represent you.",
          };
          this.deleteFlashMessage();
          this.loading = false;
          throw Error;
        }
        const reader = new FileReader();
        reader.readAsDataURL(input.files[0]);

        // convert image to string to store it.
        reader.addEventListener("load", () => {
          try {
            let image = reader.result;
            image = image.split(",");
            image = image[1];
            this.postImage(image);
            console.log(image);
            return image;
          } catch (error) {
            console.error(error);
            throw error;
          }
        });
      });
      this.loading = false;
    },
  },
  components: {
    BottomNav,
    FlashMessage,
  },
};
</script>
<template>
  <div class="w-full px-4 min-h-full h-auto">
    <div
      class="
        w-full
        h-96
        mt-6
        bg-blue-400
        flex
        items-center
        justify-center
        border-4 border-gray-800
      "
    >
      <div class="flex flex-col space-y-4 items-center">
        <img src="/icons/upload.svg" alt="" class="w-16 h-16" />
        <button
          class="
            flex flex-row
            px-4
            py-2
            rounded-md
            bg-green-400
            font-bold
            text-gray-50
          "
          @click="uploadImage"
        >
          <span v-if="loading" id="loading_icon">
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path></svg
          ></span>
          Upload your images
        </button>
      </div>
    </div>
    <span>Your labels are: Feline, Cat, Animal</span>
    <div class="absolute bottom-0 left-0 border w-full">
      <bottom-nav />
    </div>
    <div
      id="flash_message_container"
      class="fixed right-0 bottom-0 w-full h-auto"
    >
      <flash-message
        @click="this.showFlashMessage = !this.showFlashMessage"
        v-bind="this.flashMessageData"
        v-if="this.showFlashMessage"
      />
    </div>
  </div>
</template>