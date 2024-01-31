const User = require("../models/userModels");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");

exports.isAuthenicatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("please login to access this resources", 401));
  }
  const decodeData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodeData.id);
  //jo token hai wo uskai id sai bna hai to decodedData sai uska id nikal rhai hai
  next();
});
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role:${req.user.role}is not allowed to access this resources`,
          403

          //authorizerole ek function return kr rha hai. ...roles ek aray hai aur usmai admin role aayega aur funcion jo return ho rha hai wo yai check kr rha hai ki jo role hai user ka wo role admin to nhi
        )
      );
    }
    next()
  };
  
};
