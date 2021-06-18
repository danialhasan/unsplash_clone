// FIXME: MONGODB IS CURRENTLY ALLOWING ALL INBOUND CONNECTIONS. ANYONE WITH PW CAN VIEW DATABASE.

import Vuex from 'vuex'
import axios from 'axios'

// dev url: http://localhost:9000
// prod url: http://localhost:9000

export default Vuex.createStore({
    state: {
        count: 0,
        token: localStorage.getItem('accessToken') || null,
        profile: {
            // NOTE: Data flows from here down to the Profile component, not the other way around. 
            // This gets updated first, which updates the Profile component. This pattern is for 
            // all components interacting with the store. 
            username: null,
            name: null,
            email: localStorage.getItem('email') || null
        }
    },
    mutations: {
        increase(state, n) {
            state.count += n
        },
        retrieveToken(state, token) {
            state.token = token
        },
        destroyToken(state) {
            state.token = null
        }
    },
    actions: {
        async setProfile(context, email) {
            // get profile from database and update the vuex store profile with it
            return new Promise((resolve, reject) => {
                // console.log(email)
                axios.post("http://localhost:9000/users/profile", email)
                    // get profile info from mongodb from server
                    .then((res) => {
                        //user profile data received
                        context.state.profile = res.data;
                        resolve(context.state.profile)
                    }).catch((error) => {
                        reject(error);
                        throw error
                    })
            })
        },
        async updateProfile(context, editedProfile, email) {
            // this updates the whole profile. All parts.
            axios
                .patch("http://localhost:9000/profile", profile)
                .then((res) => {
                    console.log(res.data);
                })
                .catch((err) => {
                    console.error(err);
                    throw err;
                });
        },
        async updateProfileDisplayImage(context, data) {
            // this updates the whole profiles image. Nothing else.
            return new Promise((resolve, reject) => {

                axios.patch('http://localhost:9000/users/profile/image', data)
                    .then((res) => {
                        context.dispatch('setProfile', {
                            email: data.email
                        }).then((res) => {
                            resolve("Successfully updated display image in database");
                        })
                    })
                    .catch((err) => {
                        console.error(err);
                        reject("Unable to update display image in database");
                        throw err
                    })
            })
        },

        async retrieveToken(context, credentials) { // get token from server, store in localstorage
            return new Promise((resolve, reject) => {
                axios
                    .post("http://localhost:9000/users/login/verify", {
                        email: credentials.email,
                        password: credentials.password,
                    })
                    .then((res) => {
                        const accessToken = res.data.accessToken

                        if (accessToken === undefined) {
                            // console.log("accessToken was undefined")
                            throw {
                                name: "accessToken undefined",
                                message: "accessToken given from server was undefined. This means the server received our request and credentials, rejected our credentials, and did not give us a JWT.",
                                statusCode: res.status
                            }
                        }
                        localStorage.setItem('accessToken', accessToken)
                        // console.log(localStorage.getItem('accessToken'));
                        context.commit('retrieveToken', accessToken)
                        resolve(res)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        destroyToken(context) { // log out
            if (context.getters.loggedIn) {
                return new Promise((resolve, reject) => {
                    try {
                        localStorage.removeItem('accessToken')
                        localStorage.removeItem('email')
                        context.commit('destroyToken')
                        resolve(res)
                    } catch {
                        localStorage.removeItem('accessToken')
                        localStorage.removeItem('email')
                        context.commit('destroyToken')
                        reject("destroyToken failed for some reason, but accessToken and email should still be deleted, and accessToken in vuex state should be null.")
                    }
                })
            }
        }
    },
    getters: {
        loggedIn(state) {
            return state.token !== null
        },
        getProfile(state) {
            return state.profile
        }
    }
});