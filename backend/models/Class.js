const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  img: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  availableSpots: {
    type: Number,
    required: true,
    min:[0]
  },
  initialAvailableSpots: {
    type: Number,
    required: true,
    min: [0]
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  instructorName: {
    type: String,
    ref: "User",
    select: "username"
  }
});
classSchema.virtual("bookings", {
  ref: "User",
  localField: "_id",
  foreignField: "bookings",
});
module.exports = mongoose.model("Class", classSchema);
