const mongoose = require('mongoose');
const { reset } = require('nodemon');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    phone:{
        type: Number,
        required: true,
        unique: true
    },
    resetPasswordOTP:{
        type: Number,
        default: null
    },
    resetPasswordExpires:{
        type: Date,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model('users', userSchema)
module.exports= User;

