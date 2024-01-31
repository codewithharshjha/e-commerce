const ErrorHandler = require("../utils/errorhandler");
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "internal server error";
  //wrong Mongodb Id error
  if (err.name === "CastError") {
    const message = `Resource not found invalid:${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  res.status();

  //mongo duplicate key  error
  if (err.code === 1100) {
    const message = `Duplicate ${Object.keys(err.keyValue)}Expired`;
    err = new ErrorHandler(message, 400);
  }
  //         //error:err if you want to find the exact location of error than you can do this error:err this is due to capturestacktrace

  //     //message:err.stack
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
