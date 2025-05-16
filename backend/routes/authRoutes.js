const router = require("express").Router();
const authController = require("../controllers/authController");
const userAuth = require("../middlewares/userAuth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/sendVerificationOtp", userAuth, authController.sendVerifyOtp);
router.post("/verifyEmail", userAuth, authController.verifyEmail);

module.exports = router;
