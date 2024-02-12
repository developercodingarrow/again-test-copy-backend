const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

// User Registration
router.post("/sing-up", AuthController.userRegisteraion);
router.post("/verify-otp/:token", AuthController.verifyOtp);
router.post("/forgot-password", AuthController.forgatePassword);
router.post("/reset-password/:token", AuthController.resetPassword);
router.post("/login", AuthController.userLogin);

router.use(AuthController.protect, AuthController.restricTO("super-admin"));
router.post("/create-admin", AuthController.createAdmin);

module.exports = router;
