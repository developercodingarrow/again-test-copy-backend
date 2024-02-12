const express = require("express");
const router = express.Router();
const builderController = require("../controllers/builderController");
const authController = require("../controllers/authController");
// User Registration
router.get("/all-builders", builderController.getAllBuilder);

router.use(
  authController.protect,
  authController.restricTO("admin", "super-admin", "user")
);
router.post("/create-builder", builderController.createBuilder);
router.delete("/delete-builder", builderController.deleteBuilder);

module.exports = router;
