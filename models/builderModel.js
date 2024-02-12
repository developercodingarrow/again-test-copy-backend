const mongoose = require("mongoose");
const slugify = require("slugify");

const builderSchema = new mongoose.Schema(
  {
    builderName: {
      type: String,
      require: [true, "Please Tell us your Builder Name!"],
    },
    slug: {
      type: String,
      require: [true, "slug didn't work"],
      unique: true,
    },
  },
  { timestamps: true }
);

builderSchema.pre("save", function (next) {
  this.slug = slugify(this.builderName, {
    lower: true,
  });

  next();
});

const Builders = mongoose.model("Builders", builderSchema);

module.exports = Builders;
