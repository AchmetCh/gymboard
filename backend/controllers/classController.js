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
// const dateString = req.body.date; // "2024-07-29T16:00"
// const [dateComponents, timeComponents] = dateString.split('T');
// const date = new Date(dateComponents + 'T' + timeComponents.split('.')[0]);

// const newClass = new Class({
//   title: req.body.title,
//   date,
//   availableSpots: req.body.availableSpots,
// });
  const { title, date,time, availableSpots } = req.body;
  const img = req.file ? req.file.path : "";
  try {
    const newClass = new Class({
      img,
      title,
      date,
      time,
      availableSpots,
      instructor: req.user.id,
    });
    await newClass.save();
    res.json(newClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// const bookClass = async (req, res) => {
//   try {
//       // Log incoming request details
//       console.log('Request User:', req.user);
//       console.log('Request user ID', req.user.user.id) // Log user object
//       console.log('Class ID from Params:', req.params.id); // Log class ID from URL

//       // Fetch user and class data
//       const user = await User.findById(req.user.user.id);
//       const gymClass = await Class.findById(req.params.id).populate('bookings');

//       // Log fetched data
//       console.log('Fetched User:', user); // Log fetched user
//       console.log('Fetched Gym Class:', gymClass); // Log fetched class

//       // Check if class exists
//       if (!gymClass) {
//           return res.status(404).json({ msg: "Class not found" });
//       }

//       // Check if user exists
//       if (!user) {
//           return res.status(404).json({ msg: "User not found" });
//       }

//       // Check availability and booking status
//       if (gymClass.availableSpots <= 0) {
//           return res.status(400).json({ msg: "No spots available" });
//       }

//       if (user.bookings.includes(gymClass._id.toString())) {
//           return res.status(400).json({ msg: "You have already booked this class" });
//       }

//       // Update booking information
//       user.bookings.push(gymClass._id);
//       gymClass.availableSpots -= 1;

//       // Save updated information
//       await user.save();
//       await gymClass.save();

//       // Return success response
//       res.json({ msg: "Class booked", gymClass });
//   } catch (err) {
//       // Log the error and return an error response
//       console.error('Error:', err.message);
//       res.status(500).json({ message: err.message });
//   }
// };


const bookClass = async (req, res) => {
  try {
    const user = await User.findById(req.user.user.id);
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

// const cancelBooking = async(req,res) => {
//   console.log('params' + req.params)
//     try {
//       const user = await User.findById(req.user.user.id);
//       const gymClass = await Class.findById(req.params.id)
//       console.log('gymclass'+ gymClass)
//         if (!user.bookings.includes(gymClass)) {
//             return res.status(400).json({ msg: "You have not booked this class" });
//             }
//             user.bookings.pull(gymClass._id);
//             gymClass.availableSpots += 1;
//             await user.save();
//             await gymClass.save();
//             res.json({ msg: "Booking cancelled", gymClass });
//         }catch (err) {
//             res.status(500).json({ message: err.message });
//         }
// }
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
        const classes = await Class.find({ instructor: req.user.id }).populate({
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

// const getInstructorBookings = async (req,res) => {
//     try {
//         const classes = await Class.find({instructor: req.user.user.id}).populate('bookings')
//         const classBookings = await Promise.all(classes.map(async (gymClass) => {
//             const users = await User.find({bookings: gymClass._id}, 'username email phoneNumber')
//             return { gymClass, users }
//         }))
//         res.json(classBookings);
//         } catch (err) {
//             res.status(500).json({ message: err.message });
//             }
// }

// const getInstructorBookings = async (req, res) => {
//   try {
//       // Fetch classes created by the instructor
//       const classes = await Class.find({ instructor: req.user.id }).populate({
//           path: 'bookings',
//           select: 'username email phoneNumber'
//       });

//       // Log fetched classes for debugging
//       console.log('Fetched Classes:', classes);

//       if (!classes.length) {
//           return res.status(404).json({ message: 'No classes found for this instructor' });
//       }

//       // Return the fetched classes and their bookings
//       res.json({ classes });
//   } catch (error) {
//       console.error('Error:', error.message);
//       res.status(500).json({ message: error.message });
//   }
// };


module.exports = {
    getAllClasses,
    createClass,
    bookClass,
    cancelBooking,
    getUserBookings,
    getInstructorBookings
}
