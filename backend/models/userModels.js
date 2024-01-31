const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the name"],
    maxLength: [30, "Cannot exceed from 30 character"],
    minLength: [5, "please enter the character more than 5"],
  },
  email: {
    type: String,
    required: [true, "Please enter the Email"],
    unique: true,
    validate: [validator.isEmail, "please enter the valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter the password"],
    minLength: [8, "please enter the srong passwoord"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPassworExpire: Date,
});
userSchema.pre("save", async function (next) {
  s//UserSchema .pre mtlb save honai sai pehlaai, agar password modified nhi hua to next aur agar change hua to usko hash kiya jayega
  if (!this.isModified("password")) {
    next();
  }
  //here we use this because this function once defined can be invoked for difference objects. using this keyword
  this.password = await bcrypt.hash(this.password, 10);
});
//jwt tokken
//token bna na hai user kai id kai help saii
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
  //jo original password hai aur jo password dala gya hai usko compare krega but jo password hai wo hash form hai to bcryp ussai convert krega simple form mai
};

//generating password reset token

userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};
//hashing and adding resetpasswordToken to userSchema
module.exports = mongoose.model("User", userSchema);
