const mongoose = require("mongoose");
const slugify = require("slugify");

const projectSchema = new mongoose.Schema(
  {
    projectTitle: {
      type: String,
      require: [true, "Please Tell us your project Name!"],
    },
    slug: {
      type: String,
      require: [true, "slug didn't work"],
      unique: true,
    },

    propertytype: {
      type: String,
      enum: ["affordable", "luxury"],
      default: "affordable",
    },

    projectDescription: {
      type: String,
    },
    price: {
      type: Number,
    },
    pricePrefix: {
      type: String,
    },

    reraNo: {
      type: String,
    },

    city: {
      type: String,
    },

    projectLocation: {
      type: String,
    },

    builder: {
      type: String,
    },

    basicPrice: {
      type: String,
    },
    projectArea: {
      type: String,
    },
    floors: {
      type: Number,
    },
    unitsNo: {
      type: Number,
    },
    typesofUnits: {
      type: [String],
      default: [],
    },
    Possession: {
      type: String,
    },

    featured: {
      type: Boolean,
      enum: [false, true],
      default: false,
    },

    isActive: {
      type: Boolean,
      enum: [false, true],
      default: false,
    },
    projectStatus: {
      type: String,
      enum: ["upcoming Project", "ready to move", "under constructor"],
      default: "upcoming Project",
    },

    ProjectThumblin: {
      url: {
        type: String,
      },
      altText: {
        type: String,
      },
    },

    ProjectCoverImage: [
      {
        url: {
          type: String,
          default: "project-dummy-image.jpg",
        },
        altText: {
          type: String,
          default: "project-cover-image",
        },
      },
    ],

    floorPlanImages: [
      {
        url: {
          type: String,
          default: "floor-plan-dummy-image.jpg",
        },
        altText: {
          type: String,
          default: "floor-plan-image",
        },
      },
    ],
  },
  { timestamps: true }
);

projectSchema.pre("save", function (next) {
  if (this.projectTitle) {
    const baseSlug = slugify(this.projectTitle, { lower: true });
    const randomString = Math.random().toString(36).substring(2, 6);
    this.slug = `${baseSlug}-${randomString}`;
  } else {
    const randomString = Math.random().toString(36).substring(2, 6);
    this.slug = slugify(randomString, { lower: true });
  }
  next();
});

const Projects = mongoose.model("Projects", projectSchema);

module.exports = Projects;
