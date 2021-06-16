<script>
// import UserPost from "@/components/UserPost.vue";
import UserPost from "../components/UserPost.vue";

export default {
  data() {
    return {
      loading: null,
      profile: {
        name: null,
        username: null,
        email: null,
        bio: null,
        displayImage: null,
        posts: null, // array
        likes: null, // array
        collections: null, // array
      },
      displayContent: {
        // NOTE: Only one of these properties can be true at any given time.
        posts: false,
        likes: true,
        collections: false,
      },
    };
  },
  mounted() {
    this.updateProfileInStore();
    console.log(typeof this.profile.posts);
  },
  methods: {
    async updateProfileInStore() {
      if (this.profile.name == null) {
        // either user has refreshed the page and vuex store is empty
        // or user was automatically logged in (with token) and
        // redirected to /profile.
        this.loading = true;
        let localStorageEmail = localStorage.getItem("email");

        this.$store
          .dispatch("setProfile", { email: localStorageEmail })
          .then((res) => {
            this.profile = this.$store.getters.getProfile;
            this.shortenUsername(this.profile.username);
            this.loading = false;
            return;
          })
          .catch((error) => {
            console.error("setProfile action was not successful");
            this.loading = false;
            throw error;
          });
      }
    },
    base64ToImage(str) {
      const img = new Image();
      img.src = `data:image/jpg;base64,${str}`;
      return img;
    },
    shortenUsername(username) {
      // When the username is too long for the page, trim it and add '...' to the end.
      /**
       * if username.length > 15, get the first 12 letters and add '...' to the end, and
       * display that instead of the actual username.
       */
      const usernameElement =
        document.getElementById("username_container").children[0];
      if (username.length > 15) {
        let smallString = username.substring(0, 12);
        let result = smallString.concat("...");
        usernameElement.textContent = result;
      } else {
        // console.log(`Username is short enough: ${username}`);
        usernameElement.textContent = username;
        return username;
      }
    },
    switchDisplayContentTo(content) {
      console.log(content);
      for (let contentType in this.displayContent) {
        if (contentType == content) {
          this.displayContent[contentType] = true;
        } else {
          this.displayContent[contentType] = false;
        }
      }
    },
  },
  components: { UserPost },
};
</script>
    UserPost
<template>
  <div class="profile_container">
    <!-- <h1 class="font-bold my-24 text-center text-3xl">
      Welcome, <span id="name">{{ this.profile.name }}</span>
    </h1>
    <ul>
      <img
        :src="`data:image/jpg;base64,${this.profile.displayImage}`"
        alt=""
        srcset=""
      />
      <li>Name:{{ this.profile.name }}</li>
      <li>Email:{{ this.profile.email }}</li>
      <li>Username:{{ this.profile.username }}</li>
      <li>Bio:{{ this.profile.bio }}</li>
    </ul> -->
    <div class="w-full h-auto">
      <div class="max-w-lg mx-auto h-[100px] px-4 mt-16 flex flex-row">
        <div
          id="display_image_container"
          class="flex items-center justify-center rounded-full"
        >
          <img
            :src="`data:image/jpg;base64,${this.profile.displayImage}`"
            alt="Display image/profile picture"
            srcset="
              data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkBAMAAACCzIhnAAAAG1BMVEXMzMyWlpacnJy+vr6jo6PFxcW3t7eqqqqxsbHbm8QuAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAiklEQVRYhe3QMQ6EIBAF0C+GSInF9mYTs+1ewRsQbmBlayysKefYO2asXbbYxvxHQj6ECQMAEREREf2NQ/fCtp5Zky6vtRMkSJEzhyISynWJnzH6Z8oQlzS7lEc/fLmmQUSvc16OrCPqRl1JePxQYo1ZSWVj9nxrrOb5esw+eXdvzTWfTERERHRXH4tWFZGswQ2yAAAAAElFTkSuQmCC
            "
            class="rounded-full"
          />
        </div>
        <div
          id="username_container"
          class="flex-grow justify-center flex flex-col pl-8"
        >
          <h2 class="font-bold text-2xl">Username here</h2>

          <h2 class="font-normal text-sm text-blue-500">
            Change display picture
          </h2>
        </div>
      </div>
      <div
        id="name_section"
        class="w-full h-auto pt-8 p-4 flex flex-col justify-start"
      >
        <h4 class="font-bold text-lg">{{ this.profile.name }}</h4>
        <h4 class="font-normal pt-2 text-md">{{ this.profile.bio }}</h4>
      </div>
      <div
        id="social_info_section"
        class="
          w-full
          bg-gray-50
          border-t-2 border-b-2 border-black
          flex flex-row
          justify-evenly
          py-6
        "
      >
        <div
          class="
            flex flex-col
            text-center
            min-w-[20px] min-h-[20px]
            text-lg
            font-bold
          "
        >
          <div class="w-full text-gray-800">4</div>
          <div class="w-full text-gray-500">posts</div>
        </div>
        <div
          class="
            flex flex-col
            text-center
            min-w-[20px] min-h-[20px]
            text-lg
            font-bold
          "
        >
          <div class="w-full text-gray-800">32.5k</div>
          <div class="w-full text-gray-500">followers</div>
        </div>
        <div
          class="
            flex flex-col
            text-center
            min-w-[20px] min-h-[20px]
            text-lg
            font-bold
          "
        >
          <div class="w-full text-gray-800">5</div>
          <div class="w-full text-gray-500">following</div>
        </div>
      </div>
      <div
        id="profile_content_info_section"
        class="w-full border border-red-500 py-6 flex flex-row justify-evenly"
      >
        <div
          class="
            flex flex-col
            text-center
            min-w-[20px] min-h-[20px]
            text-lg
            font-bold
          "
          @click="switchDisplayContentTo('posts')"
        >
          <div class="w-full text-gray-800">Posts</div>
          <div
            v-if="this.displayContent.posts"
            class="relative w-full h-2 bg-gray-800 rounded-full"
          ></div>
        </div>
        <div
          class="
            flex flex-col
            text-center
            min-w-[20px] min-h-[20px]
            text-lg
            font-bold
          "
          @click="switchDisplayContentTo('likes')"
        >
          <div class="w-full text-gray-800">Likes</div>
          <div
            v-if="this.displayContent.likes"
            class="relative w-full h-2 bg-gray-800 rounded-full"
          ></div>
        </div>
        <div
          class="
            flex flex-col
            text-center
            min-w-[20px] min-h-[20px]
            text-lg
            font-bold
          "
          @click="switchDisplayContentTo('collections')"
        >
          <div class="w-full text-gray-800">Collections</div>
          <div
            v-if="this.displayContent.collections"
            class="relative w-full h-2 bg-gray-800 rounded-full"
          ></div>
        </div>
      </div>
      <div id="content_container" class="w-full h-auto border border-red-500">
        <user-post
          v-if="this.displayContent.posts"
          :image="this.profile.posts"
        />
        <user-likes
          v-if="this.displayContent.posts"
          :image="this.profile.posts"
        />
        <user-collections
          v-if="this.displayContent.posts"
          :image="this.profile.posts"
        />
      </div>
    </div>
  </div>
</template>