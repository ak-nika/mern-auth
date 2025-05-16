const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({
      status: "Failed",
      message: "Unauthorized. Please log in again.",
    });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id) {
      req.user = { id: decoded.id };
    } else {
      return res.status(401).json({
        status: "Failed",
        message: "Unauthorized. Please log in again.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

module.exports = userAuth;
