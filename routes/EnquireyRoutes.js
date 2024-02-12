const express = require("express");
const router = express.Router();
const enquireyController = require("../controllers/enquireyController");
const authController = require("../controllers/authController");

router.post("/create-enquire", enquireyController.createEnquirey);
router.use(authController.protect, authController.restricTO("super-admin"));
router.get("/all-enquirey", enquireyController.getAllEnquirey);
router.delete("/delete-enquery", enquireyController.deleteEnquirey);
module.exports = router;
