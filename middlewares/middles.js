const HandleError = require("../Utilis/error");

const errorHandler = function (err, req, res, next) {
  console.log("ERRORS:", err.name);
  let error;
  //   Mongoose bad id
  if (err.name === "CastError") {
    const message = `Resourse id ${err.value} not found`;
    error = new HandleError(message, 404);
  }
  //   Mongoose bad id
  if (err.name === "Error") {
    const message = `Resourse id not found`;
    error = new HandleError(message, 404);
  }
  //Mongoose Duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new HandleError(message, 400);
  }

  //Mongoose validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new HandleError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    message: error.message || "Server Error",
    status: "Fail",
  });
};

module.exports = errorHandler;
