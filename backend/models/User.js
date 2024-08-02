const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['instructor', 'user', 'admin'],
        default: 'user'
    },
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    }]
})
module.exports = mongoose.model('User', userSchema)