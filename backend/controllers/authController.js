const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const transporter = require("../config/nodemailer");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      status: "Failed",
      message: "Please fill in all fields",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to MERN Application with Authentication",
      text: `Hi ${name},\n\nWelcome to our MERN Application with Authentication! Your account has been successfully created.\n\nBest regards,\nMERN Application with Authentication Team`,
    };
    await transporter.sendMail(mailOptions);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ status: "Success", data: user });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ status: "Failed", message: "Email already exists" });
    }

    res.status(500).json({ status: "Failed", error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "Failed",
      message: "Please fill in all fields",
    });
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ status: "Success", data: userObj });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.status(200).json({ status: "Success", message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};
