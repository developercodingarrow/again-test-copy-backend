const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");
const authController = require("../controllers/authController");

router.get("/all-cites", cityController.getAllCites);

router.use(
  authController.protect,
  authController.restricTO("admin", "super-admin", "user")
);
router.post("/create-city", cityController.createCity);
router.delete("/delete-city", cityController.deleteCity);

module.exports = router;
