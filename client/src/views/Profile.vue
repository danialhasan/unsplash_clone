<script>
// import UserPost from "@/components/UserPost.vue";
import UserPosts from "../components/UserPosts.vue";
import UserLikes from "../components/UserLikes.vue";
import UserCollections from "../components/UserCollections.vue";
import FlashMessage from "../components/FlashMessage.vue";
import SettingsModal from "../components/SettingsModal.vue";

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
        posts: [], // array, will be passed into userposts component to display in userpost component.
        likes: [], // array, will be passed into userlikes component to display in userlike component.
        collections: [], // array of objects of arrays, will be passed into usercollections component to display in usercollection component.
        followers: [], // array of users who follow the profile.
        following: [], // array of users who the profile follows.
      },
      displayContent: {
        // NOTE: Only one of these properties can be true at any given time.
        posts: true,
        likes: false,
        collections: false,
      },
      showFlashMessage: false,
      flashMessageData: {
        role: "success",
        backgroundColor: "bg-indigo-100",
        accentColor: "border-indigo-500",
        textColor: "text-indigo-700",
        title: "Success!",
        description: "This is a success message!",
      },
      showSettings: false,
    };
  },
  mounted() {
    this.updateProfileInStore();
  },
  methods: {
    deleteFlashMessage() {
      setTimeout(() => {
        this.showFlashMessage = false;
      }, 5000);
    },
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
            this.showFlashMessage = true;
            this.flashMessageData = {
              role: "alert",
              backgroundColor: "bg-red-100",
              accentColor: "border-red-500",
              textColor: "text-red-700",
              title: "We couldn't get your profile information :(",
              description:
                "Please check your internet connection and refresh the page. ",
            };
            this.deleteFlashMessage();
            this.loading = false;
            throw error;
          });
      }
    },
    changeDisplayImage() {
      this.loading = true;
      /**
       * read file from users filesystem. When they choose a file,
       * dispatch an action to store to update the database through the
       * server. If successful, update the store with the received database
       * contents. Since the profile relies on the store, it will automatically update.
       */
      let input = document.createElement("input");

      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/png,image/jpg,image/jpeg");
      input.setAttribute("id", "file_input");

      input.click();

      input.addEventListener("change", () => {
        let imageSize = input.files[0].size;
        if (imageSize > 1e6) {
          // the image chosen by the user is too big
          console.error("Image file is too big!");
          console.error(`File size: ${imageSize / 1e6}MB`);
          console.error(`Maximum File size: 1MB`);
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
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(input.files[0]);

        // convert image to string to store it.
        reader.addEventListener("load", () => {
          let image = reader.result;
          image = image.split(",");
          image = image[1];

          this.showFlashMessage = true;
          this.flashMessageData = {
            role: "pending",
            backgroundColor: "bg-indigo-100",
            accentColor: "border-indigo-500",
            textColor: "text-indigo-700",
            title: "Display image change pending",
            description: "We're updating your display image, hold on...",
          };

          this.$store
            .dispatch("updateProfileDisplayImage", {
              image,
              email: this.profile.email,
            })
            .then((res) => {
              this.profile = this.$store.getters.getProfile;
              console.log(
                "Updated image in database, received image from server and updated profile info on client"
              );
              this.showFlashMessage = true;
              this.flashMessageData = {
                role: "success",
                backgroundColor: "bg-green-100",
                accentColor: "border-green-500",
                textColor: "text-green-700",
                title: "Display image change successful",
                description: res,
              };
              this.deleteFlashMessage();
              this.loading = false;
            })
            .catch((err) => {
              console.error(err);
              this.showFlashMessage = true;
              this.flashMessageData = {
                role: "alert",
                backgroundColor: "bg-red-100",
                accentColor: "border-red-500",
                textColor: "text-red-700",
                title: "We couldn't update your display image",
                description:
                  "There was an issue updating your display image. Please refresh the page and try again.",
              };
              this.deleteFlashMessage();

              this.loading = false;
              throw err;
            });
        });
      });
      this.loading = false;
      return false;
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
        document.getElementById("username_container").children[0].children[0];
      if (username.length > 15) {
        let smallString = username.substring(0, 12);
        let result = smallString.concat("...");
        usernameElement.textContent = `@${result}`;
      } else {
        // console.log(`Username is short enough: ${username}`);
        usernameElement.textContent = `@${username}`;
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
    comments() {
      /**
       * Since editing the image and editing the whole profile are two different processes, I'm
       * going to use seperate actions for them.
       *
       * for changing the current displayImage, make the following action:
       * updateProfileDisplayImage: This vuex action takes an image as a parameter (which will have been given from the user)
       * and makes a patch request to the server with the image and profile email. The server receives the image, locates the
       * user using the email provided and updates that profiles display image. It then returns a successful status code. Upon
       * receiving the successful status code, the client then dispatches the setProfile action to update the users profile on
       * the front end.
       *
       * for editing the whole profile, make the following action:
       * updateProfile: This vuex action is run on the editProfile page after changes are made and a save
       * is requested. A patch request is made to the server endpoint '/profile' with the profile's email, which updates the database.
       * It returns a status code of success or failure. On success, it runs the setProfile vuex action, which sends
       * a request to the server to return the database contents of the profile specified by an email.
       *
       * What parameter should updateProfile take? It should take the updated profile contents right? How
       * do you enforce consistency in what gets sent? Do you just send the entire profile?
       *
       * I might just make a data property that is essentially the profile but changeable. The normal profile
       * gets its data from the store. This new editedProfile would initially be null (no changes), then would fill up with the
       * changes that the user makes. It would be v-model'd by the inputs of the edit, and would serve as what gets sent as the
       * parameter for the updateProfile action. On the server or the action itself, the editedProfile object would be looped
       * through. If a property is null, it is not updated. If it isn't null, it would be updated.
       * Alternatively, I can send
       * the editedProfile object but instead of properties starting at null and then becoming filled through edits, I can just
       * make it a duplicate of the profile that is currently unedited (accessed in this components data property). On save
       * (submission), I can compare the differences between the edited profile and the unedited profile. Properties that match
       * are left behind. Properties of the edited profile that conflict with properties of the old unedited profile are sent
       * as parameters to the updateProfile action (as an object with keys that match the keys of the profile in the database.
       * That in turn sends the parameters to the server
       *
       * I can send it to the server, and the server can pull the unedited (old) profile from the database and compare changes.
       *
       * Maybe I should leave the
       * updateProfile action for the editProfile component.
       */
    },
    settings() {
      console.log("Settings clicked");
    },
  },
  components: {
    UserPosts,
    UserLikes,
    UserCollections,
    FlashMessage,
    SettingsModal,
  },
};
</script>
<template>
  <div class="profile_container">
    <div class="w-full h-auto">
      <div class="max-w-lg mx-auto h-[100px] px-4 mt-16 flex flex-row">
        <div
          id="display_image_container"
          class="
            flex
            items-center
            justify-center
            rounded-full
            max-w-[100px] max-h-[100px]
          "
        >
          <img
            :src="`data:image/jpg;base64,${this.profile.displayImage}`"
            @click="changeDisplayImage"
            alt="Display image/profile picture"
            class="rounded-full w-full h-full object-cover"
          />
        </div>
        <div
          id="username_container"
          class="flex-grow justify-center flex flex-col pl-8"
        >
          <div class="flex flex-row">
            <h2 class="font-bold text-2xl">Username here</h2>
            <span class="w-auto h-full" @click="this.showSettings = true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </span>
          </div>
          <h2
            class="font-normal text-sm text-blue-500"
            @click="changeDisplayImage"
          >
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
          <div class="w-full text-gray-800">
            {{ this.profile.posts.length }}
          </div>
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
          <div class="w-full text-gray-800">
            {{ this.profile.followers.length }}
            <!-- This is initially zero, then is set to whatever the server sends. This is because this.profile -->
          </div>
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
          <div class="w-full text-gray-800">
            {{ this.profile.following.length }}
          </div>
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
        <user-posts
          v-if="this.displayContent.posts"
          :posts="this.profile.posts"
        />
        <user-likes
          v-if="this.displayContent.likes"
          :likes="this.profile.likes"
        />
        <user-collections
          v-if="this.displayContent.collections"
          :collections="this.profile.collections"
        />
      </div>
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
    <div
      class="
        absolute
        top-0
        left-0
        w-screen
        h-screen
        flex
        justify-center
        items-center
        backdrop-filter backdrop-brightness-[0.35]
        z-10
      "
      v-if="this.showSettings"
    >
      <!--
        NOTE: In the future I want to close the menu when the parent element is clicked, not the settings modal.
        Essentially, when the background is clicked.
      -->
      <settings-modal @settingsCancelled="this.showSettings = false" />
    </div>
  </div>
</template>