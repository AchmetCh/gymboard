const Class = require("../models/Class");
const User = require("../models/User");

const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createClass = async (req, res) => {
  const { title, date, availableSpots } = req.body;
  const img = req.file ? req.file.path : "";
  try {
    const newClass = new Class({
      img,
      title,
      date,
      availableSpots,
      instructor: req.use.id,
    });
    await newClass.save();
    res.json(newClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const bookClass = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const gymClass = await Class.findById(req.params.id).populate('bookings')

    if (gymClass.availableSpots <= 0) {
      return res.status(400).json({ msg: "No spots available" });
    }
    if (user.bookings.includes(gymClass._id)) {
        return res.status(400).json({ msg: "You have already booked this class" });
        }
    user.bookings.push(gymClass.id);
    gymClass.availableSpots -= 1;
    await user.save();
    await gymClass.save();
    res.json({ msg: "Class booked", gymClass });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cancelBooking = async(req,res) => {
    try {
        const user = await User.findById(req.user.id);
        const gymClass = await Class.findById(req.params.id)
        if (!user.bookings.includes(gymClass._id)) {
            return res.status(400).json({ msg: "You have not booked this class" });
            }
            user.bookings.pull(gymClass._id);
            gymClass.availableSpots += 1;
            await user.save();
            await gymClass.save();
            res.json({ msg: "Booking cancelled", gymClass });
        }catch (err) {
            res.status(500).json({ message: err.message });
        }
}

const getUserBookings = async(req,res) => {
    try {
        const user = await User.findById(req.user.id).populate('bookings');
        res.json(user.bookings);
        } catch (err) {
            res.status(500).json({ message: err.message });
            }
    }

const getInstructorBookings = async (req,res) => {
    try {
        const classes = await Class.find({instructor: req.user.id}).populate('bookings')
        const classBookings = await Promise.all(classes.map(async (gymClass) => {
            const users = await User.find({bookings: gymClass._id}, 'username email phoneNumber')
            return { gymClass, users }
        }))
        res.json(classBookings);
        } catch (err) {
            res.status(500).json({ message: err.message });
            }
}
module.exports = {
    getAllClasses,
    createClass,
    bookClass,
    cancelBooking,
    getUserBookings,
    getInstructorBookings
}
