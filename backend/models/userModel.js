const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    select: false,
  },
  verifyOtp: {
    type: String,
    default: "",
    select: false,
  },
  verifyOtpExpireAt: {
    type: Number,
    default: 0,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetOtp: {
    type: String,
    default: "",
    select: false,
  },
  resetOtpExpireAt: {
    type: Number,
    default: 0,
    select: false,
  },
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
