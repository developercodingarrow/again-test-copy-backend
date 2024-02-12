const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");

router.use(authController.protect, authController.restricTO("super-admin"));
router.get("/all-admins", adminController.getAllAdmins);

module.exports = router;
