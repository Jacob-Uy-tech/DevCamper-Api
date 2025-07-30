const HandleError = require("./../Utilis/error");
const asyncWrapper = require("../middlewares/asyncHandler");
const User = require("../models/userModel");

//Helper functions
const sendTokenFn = function (user, statusCode, res) {
  const token = user.sendToken();
  const option = {
    httpOnly: true,
    maxAge: Date.now() + process.env.COOKIE_EXPIRES * 60 * 60 * 24 * 1000,
    // secure:true
  };
  res.status(statusCode).cookie("token", token, option).json({
    status: "Success",
    token,
    user,
  });
};

//Auth functions
exports.register = asyncWrapper(async function (req, res, next) {
  const { name, email, password, confirmPassword, role } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
    role,
  });

  sendTokenFn(newUser, 201, res);
});

exports.login = asyncWrapper(async function (req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new HandleError("Enter your email or password"));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new HandleError("Invalid credential"));
  }

  const checkPassword = user.comparePassword(password);
  if (!checkPassword) {
    return next(new HandleError("Invalid credential"));
  }

  sendTokenFn(user, 200, res);
});

exports.protectedRoute = asyncWrapper(async function (req, res, next) {
  let token;
  console.log("Hello world");
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  next();
});
