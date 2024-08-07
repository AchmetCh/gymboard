const Class = require("../models/Class");
const User = require("../models/User");
const fs = require('fs');
const path = require('path');

const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createClass = async (req, res) => {
  const { title, date,time, availableSpots,instructor, instructorName } = req.body;
  const img = req.file ? req.file.path : "";
  try {
    const newClass = new Class({
      img,
      title,
      date,
      time,
      availableSpots,
      instructor,
      instructorName
    });
    await newClass.save();
    res.json(newClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteClass = async (req,res) => {
  try {
    const deleteClass = await Class.findByIdAndDelete(req.params.id)
    if (!deleteClass) return res.status(404).json({msg: 'Class not found'})
      await User.updateMany({bookings: req.params.id}, {pull: {bookings: req.params.id}})
      res.json({msg: 'Class deleted successfully'})
    } catch (err) {
      res.status(500).json({ message: err.message });
      }
}


const bookClass = async (req, res) => {
  try {
    const user = await User.findById(req.user.user.id);
    const gymClass = await Class.findById(req.params.id).populate('bookings')

    if (gymClass.availableSpots <= 0) {
      return res.status(400).json({ msg: "No spots available" });
    }
    if (user.bookings.includes(gymClass._id)) {
        return res.status(400).json({ msg: "You've already secured your spot!" });
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

const cancelBooking = async (req, res) => {
  try {
      const user = await User.findById(req.user.user.id);
      const gymClass = await Class.findById(req.params.id)

      if (!user.bookings.includes(gymClass._id)) {
          return res.status(400).json({ msg: "You have not booked this class" });
      }

      user.bookings.pull(gymClass._id);
      gymClass.availableSpots += 1;
      await user.save();
      await gymClass.save();
      res.json({ msg: "Booking cancelled", gymClass });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
}

const getUserBookings = async(req,res) => {
    try {
        const user = await User.findById(req.user.user.id).populate('bookings');
        res.json(user.bookings);
        } catch (err) {
            res.status(500).json({ message: err.message });
            }
    }

    const getInstructorBookings = async (req, res) => {
      try {
        //{ instructor: req.user.user.id } when want to filter by instructor bookings
        const classes = await Class.find().populate({
          path: 'bookings',
          model: 'User',
          select: 'username email phoneNumber'
        });
        const classBookings = await Promise.all(classes.map(async (gymClass) => {
          const users = await User.find({ bookings: gymClass._id }, 'username email phoneNumber')
        console.log(gymClass.title)
        console.log(users.map(a => a.username))
          return { gymClass, users }
        }))
        res.json(classBookings);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }

   const instructorResetAvailableSpots = async (req, res) => {
    try {
      const classes = await Class.find({ instructor: req.user.id });
      classes.forEach(async (gymClass) => {
        gymClass.availableSpots = 10;
        await gymClass.save();
        // Remove the class from the user's bookings
        await User.updateMany({ bookings: gymClass._id }, { $pull: { bookings: gymClass._id } });
      });
      res.json({ msg: "Available spots reset" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

    const getAllUsers = async (req,res) => {
      try {
        const users = await User.find().select('-password')
        res.json(users);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }

    const updateUserRole = async (req,res) => {
      const {id} = req.params
      const {role} = req.body
      try {
        const user = await User.findByIdAndUpdate(id, {role}, {new: true})
        res.json(user);
    }catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  const cleanupUploads = async (req, res) => {
    try {
      // Get the list of all image filenames in the uploads directory
      const uploadDir = path.join(__dirname, '../uploads');
      const files = fs.readdirSync(uploadDir);
  
      // Get the list of all image filenames referenced in the Class collection
      const classes = await Class.find({}, 'img');
      const classImages = classes.map(cls => path.basename(cls.img));
  
      // Find and delete orphaned files
      files.forEach(file => {
        if (!classImages.includes(file)) {
          const filePath = path.join(uploadDir, file);
          fs.unlinkSync(filePath);
          console.log(`Deleted orphaned file: ${filePath}`);
        }
      });
  
      res.json({ msg: 'Uploads folder cleaned up' });
    } catch (err) {
      console.error('Error during cleanup process:', err);
      res.status(500).json({ message: err.message });
    }
  };




module.exports = {
    getAllClasses,
    createClass,
    deleteClass,
    bookClass,
    cancelBooking,
    getUserBookings,
    getInstructorBookings,
    instructorResetAvailableSpots,
    getAllUsers,
    updateUserRole,
    cleanupUploads
}
