const { lowerCase, trim } = require("lodash")
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true,
        lowerCase: true,
        trim: true
    },

    password : {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("User", userSchema)