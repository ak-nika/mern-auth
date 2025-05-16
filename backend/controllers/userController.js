const User = require("../models/userModel");

exports.getUser = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "Failed", message: "User not found" });
    }
    res.status(200).json({ status: "Success", data: user });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};
