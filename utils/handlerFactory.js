const fs = require("fs").promises;
const path = require("path");
const catchAsync = require("./catchAsync");
const AppError = require("./appError");

// This function for CRETE one
exports.createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      result: doc,
    });
  });
};

// This function for GET ALL
exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.find();
    res.status(200).json({
      status: "success",
      total: doc.length,
      result: doc,
    });
  });
};

// This function for GET ALL
exports.getOneBySlug = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findOne({ slug: req.params.slug });
    res.status(200).json({
      status: "success",
      total: doc.length,
      result: doc,
    });
  });
};

// This function for GET ALL
exports.getOneByID = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findOne({ _id: req.params.id });
    res.status(200).json({
      status: "success",
      total: doc.length,
      result: doc,
    });
  });
};

// This function for Delete one
exports.deleteOneByBody = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.body.id);

    if (!doc) {
      return next(new AppError("NO Document found with this ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
};

// This function for Update one
exports.updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("NO Document found with this ID", 404));
    }

    res.status(201).json({
      status: "success",
      result: doc,
    });
  });
};

exports.toggleBooleanField = (Model, fieldName) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with this ID", 404));
    }

    // Toggle the boolean field
    doc[fieldName] = !doc[fieldName];

    // Save the updated document
    await doc.save();

    res.status(200).json({
      status: "success",
      data: {
        [fieldName]: doc[fieldName],
      },
    });
  });
};

// Generic function to update a document's thumbnail image by slug for any model and field name
exports.updateThumblinByIdAndField = (Model, fieldName) => {
  return catchAsync(async (req, res, next) => {
    console.log(req);
    const image = req.files[0].filename;
    const id = req.params.id;
    // Create an object with the dynamically provided field name
    const updateObject = {
      [fieldName]: {
        url: image,
        altText: req.files[0].originalname,
      },
    };
    // Find and update the document based on the provided slug
    const data = await Model.findByIdAndUpdate(id, updateObject, {
      new: true,
      upsert: true,
    });

    // Respond with a success message and the updated data
    return res.status(200).json({
      status: "success",
      message: `${fieldName} updated successfully`,
      data,
    });
  });
};

// Generic function to upload cover images for any model and field name
exports.uploadGalleryByIdAndField = (Model, fieldName) => {
  return catchAsync(async (req, res, next) => {
    const galleryImages = req.files;
    const id = req.params.id;
    const images = galleryImages.map((file) => ({
      url: file.filename,
      altText: req.body.altText,
      descreption: req.body.descreption,
    }));

    // Use findByIdAndUpdate to find the document by ID and update it
    const data = await Model.findByIdAndUpdate(
      id,
      {
        $push: { [`${fieldName}`]: { $each: images } },
      },
      { new: true }
    );

    if (!data) {
      return res
        .status(404)
        .json({ status: "error", message: `${fieldName} not found` });
    }

    res.status(201).json({
      status: "success",
      data,
    });
  });
};

exports.deleteGalleryImage = (Model, fieldName) => {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { imageId } = req.body;

    const data = await Model.findById(id);
    if (!data) {
      return next(new AppError("There is no data", 404));
    }

    // Find the image in the specified array
    const deletedImage = data[fieldName].find(
      (photo) => photo._id.toString() === imageId
    );

    // Remove the image from the specified array
    data[fieldName] = data[fieldName].filter(
      (photo) => photo._id.toString() !== imageId
    );

    // Save the updated document
    await data.save();

    // Delete the image file from the folder
    const imagePath = path.resolve(
      `${__dirname}/../../frontend-saranshrealtorsindia/public/project-images/${deletedImage.url}`
    );

    try {
      await fs.unlink(imagePath);
      console.log(`Image deleted: ${deletedImage.url}`);
    } catch (error) {
      console.error(`Error deleting image: ${error.message}`);
    }

    res.status(200).json({
      results: data.length,
      status: "Success",
      message: "Delete Image",
      result: data,
    });
  });
};

exports.deleteSingleImage = (Model, fieldName, imagePath) => {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { imageId } = req.body;

    const data = await Model.findById(id);
    if (!data) {
      return next(new AppError("There is no data", 404));
    }

    const deletedImage = data[fieldName];

    if (!deletedImage) {
      return next(new AppError("Image not found", 404));
    }

    // Remove the image field
    data[fieldName] = undefined;

    await data.save();

    const imagePathToDelete = path.resolve(
      `${__dirname}/../../frontend-saranshrealtorsindia/public/${imagePath}/${deletedImage.url}`
    );

    try {
      await fs.unlink(imagePathToDelete);
      console.log(`Image deleted: ${deletedImage.url}`);
    } catch (error) {
      console.error(`Error deleting image: ${error.message}`);
    }

    res.status(204).json({
      status: "success",
      message: "Delete Image",
    });
  });
};
