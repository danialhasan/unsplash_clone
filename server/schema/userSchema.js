const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    hashedPassword: {
        type: String,
        required: [true, 'Hashed Password is required']
    },
})

module.exports = userSchema