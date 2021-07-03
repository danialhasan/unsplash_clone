// FIXME: MONGODB IS CURRENTLY ALLOWING ALL INBOUND CONNECTIONS. ANYONE WITH PW CAN VIEW DATABASE.

import Vuex from 'vuex'
import axios from 'axios'

// dev url: http://localhost:9000
// prod url: https://unsplash-clone-dh.herokuapp.com
// const serverURL = 'http://localhost:9000'
const serverURL = 'https://unsplash-clone-dh.herokuapp.com'

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
        async postImage(context, imageParams) {
            // console.log("postImage action dispatched!");
            // console.log('Email: ', context.state.profile.email)
            return new Promise((resolve, reject) => {
                axios.post(`${serverURL}/api/image`, {
                        imageParams,
                        email: context.state.profile.email
                    })
                    .then((res) => {
                        console.log(res)
                        resolve(res)
                    }).catch((error) => {
                        console.error("There was an error in postImage action in Vuex store")
                        reject(error)
                        throw error;
                    })
            })
        },
        async setProfile(context, email) {
            // get profile from database and update the vuex store profile with it
            return new Promise((resolve, reject) => {
                axios.post(`${serverURL}/users/profile`, email)
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
        async registerAccount(context, newAccount) {
            return new Promise((resolve, reject) => {
                axios
                    .post(`${serverURL}/users/register`, {
                        name: newAccount.name,
                        email: newAccount.email,
                        username: newAccount.username,
                        password: newAccount.password,
                        verifyPassword: newAccount.verifyPassword,
                    })
                    .then((res) => {
                        resolve(res)
                    }).catch((err) => {
                        console.error(err)
                        reject(err)
                    })
            })
        },
        async updateProfile(context, editedProfile) {
            // make server request to find user with the email specified, then change the details to the ones given in 
            // editedProfile. NOTE: Make sure to change localstorage email to new updated email once database is updated.
            // console.log(editedProfile)
            return new Promise((resolve, reject) => {
                axios
                    .patch(`${serverURL}/users/profile`, editedProfile)
                    .then((res) => {
                        resolve(res) // return success message to component
                    })
                    .catch((err) => {
                        console.error(err);
                        reject(err) // return error message to component
                        throw err;
                    })
            })
        },
        async updateProfileDisplayImage(context, data) {
            // this updates the whole profiles image. Nothing else.
            return new Promise((resolve, reject) => {
                axios.patch(`${serverURL}/users/profile/image`, data)
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
                    .post(`${serverURL}/users/login/verify`, {
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