const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
require('dotenv').config()

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name cannot be empty'],
    },
    email: {
        type: String,
        required: [true, "Please provide an email!"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please set a password.'],
        minlength: 8
    }
})

UserSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next()
})

UserSchema.methods.getName = function () {
    return this.name
}

UserSchema.methods.createJWT = function () {
    return jwt.sign({ userID: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE});
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
}


module.exports = mongoose.model('User', UserSchema);