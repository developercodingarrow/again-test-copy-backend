const mongoose = require("mongoose");
const slugify = require("slugify");

const citySchema = new mongoose.Schema(
  {
    city: {
      type: String,
      require: [true, "Please Tell us your City!"],
    },
    slug: {
      type: String,
      require: [true, "slug didn't work"],
      unique: true,
    },
  },
  { timestamps: true }
);

citySchema.pre("save", function (next) {
  this.slug = slugify(this.city, {
    lower: true,
  });

  next();
});

const Cities = mongoose.model("Cities", citySchema);

module.exports = Cities;
