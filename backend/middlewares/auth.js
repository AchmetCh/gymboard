const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();
const SALT_ROUNDS = +process.env.SALT_ROUNDS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");
  try {
    const decoded = jwt.verify(token, PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};

const instructorAuth = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.role !== "instructor")
    return res.status(403).json({ msg: "Access denied" });
  next();
};
module.exports = { auth, instructorAuth };
