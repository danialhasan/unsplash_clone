import Vuex from 'vuex'
import axios from 'axios'

export default Vuex.createStore({
    state: {
        count: 0,
        token: localStorage.getItem('accessToken') || null,
        profile: {
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
            return new Promise((resolve, reject) => {
                // console.log(email)
                axios.post("http://localhost:9000/users/profile", email)
                    // get profile info from mongodb from server
                    .then((res) => {
                        //  if (res.statusCode == 217)  console.log(res.data);

                        //user profile data received
                        context.state.profile = res.data;
                        // console.log("Profile set:")
                        // console.log(context.state.profile)
                        resolve(context.state.profile)
                    }).catch((error) => {
                        reject(error)
                        throw error
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
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token
            if (context.getters.loggedIn) {
                return new Promise((resolve, reject) => {
                    axios
                        .delete("http://localhost:9000/users/logout")
                        .then((res) => {
                            localStorage.removeItem('accessToken')
                            localStorage.removeItem('email')
                            context.commit('destroyToken')
                            resolve(res)
                        })
                        .catch((error) => {
                            localStorage.removeItem('accessToken')
                            context.commit('destroyToken')

                            reject(error)
                        })
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