const express = require( 'express' );
const router = express.Router();
const multer = require('multer')
const {auth, instructorAuth} = require('../middlewares/auth')
const {getAllClasses, createClass, bookClass, cancelBooking, getUserBookings, getInstructorBookings} = require('../controllers/classController')


const fs = require('fs');

const uploadsDir = './uploads';

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename:(req,file,cb) => {
        cb(null, `${Date.now( )} - ${file.originalname}`)

    }
})
const upload = multer({ storage })

router.get('/classes',auth, getAllClasses)
router.post('/classes', auth,instructorAuth, upload.single('img'), createClass)
router.post('/classes/book/:id', auth, bookClass)
router.delete('/classes/cancel/:id', auth, cancelBooking)
router.get('/my-bookings', auth, getUserBookings)
router.get('/instructor-bookings', auth, instructorAuth, getInstructorBookings)

module.exports = router
