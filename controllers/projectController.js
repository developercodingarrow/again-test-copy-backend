const Projects = require("../models/projectModel");
const Factory = require("../utils/handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

//1) CREATE PROJECT API
exports.createProject = Factory.createOne(Projects);
//2) DELETE PROJECT API
exports.deleteProject = Factory.deleteOneByBody(Projects);
//3) GET ALL PROJECT API
exports.getAllProjets = Factory.getAll(Projects);
//4) GET SINGLE PROJECT API
exports.getProject = Factory.getOneByID(Projects);
exports.getSingleProject = Factory.getOneBySlug(Projects);

exports.updateProject = Factory.updateOne(Projects);

exports.updateFeatureProject = Factory.toggleBooleanField(Projects, "featured");

exports.toogleIsActive = Factory.toggleBooleanField(Projects, "isActive");
//5) UPDATE PROJECT THUMBLIN API
exports.uploadThumblin = Factory.updateThumblinByIdAndField(
  Projects,
  "ProjectThumblin"
);
// 6) UPDATE PROJECT GALLERY API
exports.uploadCoverImages = Factory.uploadGalleryByIdAndField(
  Projects,
  "ProjectCoverImage"
);
// 7)UPDATE PROJECT FLOOR PLAN API
exports.uploadFloorPlanImages = Factory.uploadGalleryByIdAndField(
  Projects,
  "floorPlanImages"
);

// exports.deleteGalleryImage = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const imageId = req.body.id;

//   const data = await Projects.findById(id);
//   if (!data) {
//     return next(new AppError("There is no data", 404));
//   }

//   // Find the image in the galleryPhotos array
//   const deletedImage = data.ProjectCoverImage.find(
//     (photo) => photo._id.toString() === imageId
//   );

//   // Remove the image from the galleryPhotos array
//   data.ProjectCoverImage = data.ProjectCoverImage.filter(
//     (photo) => photo._id.toString() !== imageId
//   );

//   // Save the updated document
//   await data.save();

//   res.status(200).json({
//     results: data.length,
//     status: "Success",
//     message: "Delete Image",
//     result: data,
//   });
// });

exports.deleteProjectCoverImage = Factory.deleteGalleryImage(
  Projects,
  "ProjectCoverImage"
);

// Example usage for deleting FloorPlanImages
exports.deleteFloorPlanImage = Factory.deleteGalleryImage(
  Projects,
  "floorPlanImages"
);

exports.deleteProjectThumblin = Factory.deleteSingleImage(
  Projects,
  "ProjectThumblin",
  "project-thumblin"
);

function buildFilter(queryObj) {
  let filter = {};

  // Pagination logic
  // const page = parseInt(queryObj.page) || 1;
  // const limit = parseInt(queryObj.limit) || 2;
  // console.log(page, "page value");
  // console.log(limit, "limit value");
  // const skip = (page - 1) * limit;
  // console.log(skip, "skip value");

  for (const key in queryObj) {
    if (Object.hasOwnProperty.call(queryObj, key)) {
      const value = queryObj[key];
      console.log(value);
      // Check each query parameter and construct the filter accordingly
      switch (key) {
        case "searchTerm":
          // Construct a $or query to search in multiple fields
          filter.$or = [
            { projectTitle: { $regex: new RegExp(value, "i") } },
            { city: { $regex: new RegExp(value, "i") } },
            { builder: { $regex: new RegExp(value, "i") } },
          ];
          break;
        case "minPrice":
          // Construct a filter for projects with price greater than the provided value
          filter.price = { $gt: parseFloat(value) };
          break;
        case "unitTypes":
          // Construct a filter to match projects with types of units specified
          const unitTypesArray = value
            .split(",")
            .map((unitType) => unitType.trim().toLowerCase());
          filter.typesofUnits = {
            $in: unitTypesArray.map((unit) => new RegExp(unit, "i")),
          };
          break;
        case "city":
          // Construct a filter to match projects in the specified cities (comma-separated list)
          const cityArray = value
            .split(",")
            .map((city) => new RegExp(city.trim(), "i"));
          filter.city = { $in: cityArray };
          break;
        case "builder":
          // Construct a filter to match projects with the specified builders (comma-separated list)
          const builderArray = value
            .split(",")
            .map((builder) => new RegExp(builder.trim(), "i"));
          filter.builder = { $in: builderArray };
          break;
        case "projectStatus":
          // Construct a filter to match projects with the specified project statuses (comma-separated list)
          const projectStatusArray = value
            .split(",")
            .map((status) => new RegExp(status.trim(), "i"));
          filter.projectStatus = { $in: projectStatusArray };
          break;
        // Add more cases for other query parameters if needed
        default:
          // Handle other query parameters if necessary
          break;
      }
    }
  }

  return { filter };
}

exports.fillterProjects = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "filed", "order", "search"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // Build the filter object
  const { filter } = buildFilter(queryObj);

  // Execute the query
  console.log(filter);

  const sortOptions = { updatedAt: -1 };
  const data = await Projects.find(filter).sort(sortOptions);

  res.status(200).json({
    total: data.length,
    status: "success",
    result: data,
  });
});
