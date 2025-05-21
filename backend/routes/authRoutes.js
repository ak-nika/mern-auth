const router = require("express").Router();
const authController = require("../controllers/authController");
const userAuth = require("../middlewares/userAuth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/sendVerificationOtp", userAuth, authController.sendVerifyOtp);
router.post("/verifyEmail", userAuth, authController.verifyEmail);
router.post("/sendResetOtp", authController.sendPasswordReset);
router.post("/resetPassword", authController.resetPassword);

router.get("/isAuthenticated", userAuth, authController.isAuthenticated);

module.exports = router;
