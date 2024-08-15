const express = require('express')
const router = express.Router()
const {createUser,register, login} = require('../controllers/authControllers')
const { auth, instructorAuth, adminAuth } = require("../middlewares/auth");

router.post('/register', register)
router.post('/createUser',auth, adminAuth, createUser)
router.post('/login', login)

module.exports = router