const router = require("express").Router();
const userController = require("../controllers/userController");
const userAuth = require("../middlewares/userAuth");

router.get("/", userAuth, userController.getUser);

module.exports = router;
