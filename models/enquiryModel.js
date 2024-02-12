const mongoose = require("mongoose");
const slugify = require("slugify");

const enquirySchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: [true, "Please Tell us your Name!"],
    },

    userEmail: {
      type: String,
      require: [true, "Please Tell us your Email!"],
    },

    userNumber: {
      type: Number,
      require: [true, "Please Tell us your Mobile!"],
    },

    enquryPath: {
      type: String,
    },

    userMessage: {
      type: String,
    },
  },
  { timestamps: true }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);

module.exports = Enquiry;
