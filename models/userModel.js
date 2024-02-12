const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Please Tell us your name!"],
    },

    email: {
      type: String,
      require: [true, "Please Provide your email!"],
      unique: true,
    },
    role: {
      type: String,
      enum: ["super-admin", "admin", "employee", "user"],
      default: "super-admin",
    },
    password: {
      type: String,
      require: [true, "please provide your password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      require: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el == this.password;
        },
        message: "confirm password didn't match",
      },
    },

    otp: String,
    otpTimestamp: Date,
    isVerified: Boolean,
    otpgenerateToken: String,
    passwordChangeAt: Date,
    PasswordResetToken: String,
    PasswordResetExpires: Date,
  },
  { timestamps: true }
);

// Hash The Password when new User Register
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Password Reset Token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.PasswordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.PasswordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// check password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// pass changetAt pass is chnaged or not after ishued token
userSchema.methods.changePasswordAfterToken = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
