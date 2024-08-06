const express = require("express");
const router = express.Router();
const multer = require("multer");
const { auth, instructorAuth, adminAuth } = require("../middlewares/auth");
const {
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
} = require("../controllers/classController");

const fs = require("fs");

const uploadsDir = "./uploads";

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()} - ${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get("/classes", auth, getAllClasses);
router.post(
  "/classes",
  auth,
  instructorAuth,
  upload.single("img"),
  createClass
);
router.delete("/classes/:id",auth,instructorAuth,deleteClass);
router.post("/classes/book/:id", auth, bookClass);
router.delete("/classes/cancel/:id", auth, cancelBooking);
router.get("/my-bookings", auth, getUserBookings);
router.get("/instructor-bookings", auth, instructorAuth, getInstructorBookings);
router.put('/instructor/reset-available-spots', auth,instructorAuth, instructorResetAvailableSpots);
router.get("/users", auth, adminAuth, getAllUsers)
router.put('/users/:id/role', auth, adminAuth, updateUserRole)
router.delete('/cleanup', cleanupUploads)


module.exports = router;
