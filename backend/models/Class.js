const mongoose = require('mongoose')


const classSchema = new mongoose.Schema({
    img: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
      },
    availableSpots: {
        type: Number,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
})
classSchema.virtual('bookings', {
    ref: 'User',
    localField: '_id',
    foreignField: 'bookings'
})
module.exports = mongoose.model('Class', classSchema)