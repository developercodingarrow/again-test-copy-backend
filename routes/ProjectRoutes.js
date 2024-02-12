const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const {
  thumblinMidelwear,
  projectCoverImageMidelwear,
  projectFloorPlanImageMidelwear,
} = require("../utils/multerUploadMiddleware");

const authController = require("../controllers/authController");
router.get("/get-project/:slug", projectController.getSingleProject);
router.get("/fillter-projects", projectController.fillterProjects);

router.use(
  authController.protect,
  authController.restricTO("admin", "super-admin", "user")
);
// CREATE PROJECT ROUTE
router.post("/create-project", projectController.createProject);
router.get("/get-all-projects", projectController.getAllProjets);
router.delete("/delete-project", projectController.deleteProject);
router.get("/get-single-project/:id", projectController.getProject);

router.patch("/update-project/:id", projectController.updateProject);
router.patch(
  "/update-feature-project/:id",
  projectController.updateFeatureProject
);

router.patch("/update-is-active/:id", projectController.toogleIsActive);

router.patch(
  "/update-project-thumblin/:id",
  thumblinMidelwear,
  projectController.uploadThumblin
);

router.patch(
  "/update-project-cover-images/:id",
  projectCoverImageMidelwear,
  projectController.uploadCoverImages
);

router.patch(
  "/update-project-floor-plan-images/:id",
  projectFloorPlanImageMidelwear,
  projectController.uploadFloorPlanImages
);

router.delete(
  "/delete-project-thumblin/:id",
  projectController.deleteProjectThumblin
);

router.delete(
  "/delete-cover-image/:id",
  projectController.deleteProjectCoverImage
);

router.delete(
  "/delete-floor-plan-image/:id",
  projectController.deleteFloorPlanImage
);

module.exports = router;
