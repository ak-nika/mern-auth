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

// Send verification OTP to user email
exports.sendVerifyOtp = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "Failed", message: "User not found" });
    }
    if (user.isVerified) {
      return res
        .status(400)
        .json({ status: "Failed", message: "User already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 24px; border-radius: 8px; background-color: #ffffff; color: #333;">
              <h2 style="text-align: center; color: #4CAF50;">Account Verification</h2>
              
              <p style="font-size: 16px;">Hi there,</p>
              
              <p style="font-size: 16px;">
                Thank you for signing up! Please use the verification code below to verify your account. The code is valid for the next <strong>10 minutes</strong>.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #ffffff; background-color: #4CAF50; padding: 12px 24px; border-radius: 8px; letter-spacing: 4px;">
                  ${otp}
                </span>
              </div>
              
              <p style="font-size: 16px;">If you did not request this, please ignore this email.</p>
              
              <p style="font-size: 16px; margin-top: 40px;">Best regards,<br><strong>The MERN App Team</strong></p>
            </div>
            `,
    };
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ status: "Success", message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user.id;

  if (!userId || !otp) {
    return res
      .status(400)
      .json({ status: "Failed", message: "Invalid request" });
  }

  try {
    const user = await User.findById(userId).select(
      "verifyOtp verifyOtpExpireAt"
    );
    if (!user) {
      return res
        .status(404)
        .json({ status: "Failed", message: "User not found" });
    }
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      console.log(user.verifyOtp);
      return res.status(400).json({ status: "Failed", message: "Invalid OTP" });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ status: "Failed", message: "OTP expired" });
    }

    user.isVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    res.status(200).json({ status: "Success", message: "Email verified" });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

// Check if user is authenticated
exports.isAuthenticated = async (req, res) => {
  try {
    res.status(200).json({ status: "Success", message: "User authenticated" });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

// Send Password reset otp
exports.sendPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ status: "Failed", message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Failed", message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 24px; border-radius: 8px; background-color: #ffffff; color: #333;">
              <h2 style="text-align: center; color: #4CAF50;">Account Verification</h2>
              
              <p style="font-size: 16px;">Hi there,</p>
              
              <p style="font-size: 16px;">
                Please use the verification code below to reset your account password. The code is valid for the next <strong>10 minutes</strong>.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #ffffff; background-color: #4CAF50; padding: 12px 24px; border-radius: 8px; letter-spacing: 4px;">
                  ${otp}
                </span>
              </div>
              
              <p style="font-size: 16px;">If you did not request this, please ignore this email.</p>
              
              <p style="font-size: 16px; margin-top: 40px;">Best regards,<br><strong>The MERN App Team</strong></p>
            </div>
            `,
    };
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ status: "Success", message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ status: "Failed", message: "Please fill in all fields" });
  }

  try {
    const user = await User.findOne({ email }).select(
      "+resetOtp +resetOtpExpireAt"
    );
    if (!user) {
      return res
        .status(404)
        .json({ status: "Failed", message: "User not found" });
    }

    if (user.resetOtp !== otp || user.resetOtp === "") {
      return res.status(400).json({ status: "Failed", message: "Invalid OTP" });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res
        .status(400)
        .json({ status: "Failed", message: "OTP has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = null;
    await user.save();

    res
      .status(200)
      .json({ status: "Success", message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};
