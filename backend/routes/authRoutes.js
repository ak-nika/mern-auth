const router = require("express").Router();
const authController = require("../controllers/authController");
const userAuth = require("../middlewares/userAuth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/sendVerificationOtp", userAuth, authController.sendVerifyOtp);
router.post("/verifyEmail", userAuth, authController.verifyEmail);
router.post("/isAuthenticated", userAuth, authController.isAuthenticated);
router.post("/sendResetOtp", authController.sendPasswordReset);
router.post("/resetPassword", authController.resetPassword);

module.exports = router;
