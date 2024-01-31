const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const User = require("../models/userModels");
const sendToken = require("../utils/jwttoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary =require("cloudinary").v2
//Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const myCloud = await cloudinary.uploader.upload(req.body.avatar,{
    folder:"avatars",
    width:100,
    crop:'scale'
  })
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 201, res);
});
//login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new ErrorHandler("please enter the vailid email & password", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("invaid email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("invalid email and password"), 401);
  }
  sendToken(user, 200, res);
});
//logout user
exports.logoutUser = catchAsyncErrors(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    succes: true,
    message: "logged out",
  });
});
// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
  user.resetPasswordToken=undefined;
  user.resetPassworExpire=undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

///Reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPassworExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorHandler("reset passwod token is invalid", 400));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("reset passwod token is invalid", 400));
  }
  (user.password = req.body.password),
    (user.resetPasswordToken = undefined),
    (user.resetPassworExpire = undefined);
  await user.save();
  sendToken(user, 200, res);
});
// Get User Details

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  //jo login hoga whi use kr payega kuki login authentication kai time pai req.user mai uska sara information dal diya gya tha

  res.status(200).json({
    success: true,
    user,
  });
});
//update user password

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.Oldpassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("invalid email and password"), 401);
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not matched"), 400);
  }
  user.password = await req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

//update user profile

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newuser = {
    name: req.body.name,
    email: req.body.email,
  };

  if(req.body.avatar !==""){
    const user=await User.findById(req.user.id)
    const imageId=user.avatar.public_id
    await cloudinary.uploader.destroy(imageId)

  
  const myCloud = await cloudinary.uploader.upload(req.body.avatar,{
    folder:"avatars",
    width:100,
    crop:'scale'
  })
  newuser.avatar={
    public_id:myCloud.public_id,
    url:myCloud.secure_url
  }
}
  const user = await User.findByIdAndUpdate(req.user.id, newuser, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });
  res.status(200).json({
    success: true,
  });
});
//get all user (admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//get sinle user details (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`user does not found by this ${req.params.id}`),
      400
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//update user role
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newuser = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newuser, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });
  if (!user) {
    return next(new ErrorHandler("user with this id does not exites"));
  }
  res.status(200).json({
    success: true,
  });
});

//delete user--Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("user with this id does not found"));
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message:"user deleted successfully"
  });
});
