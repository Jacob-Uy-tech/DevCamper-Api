const HandleError = require("./../Utilis/error");
const asyncWrapper = require("../middlewares/asyncHandler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const sendMail = require("../Utilis/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

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

  // const checkPassword = await bcrypt.compare(password, user.password);
  const checkPassword = await user.comparePassword(password);
  // console.log(checkPassword);
  if (!user || !checkPassword) {
    return next(new HandleError("Invalid credential"));
  }

  sendTokenFn(user, 200, res);
  // res.status(200).json({
  //   user,
  // });
});

exports.protectedRoute = asyncWrapper(async function (req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new HandleError("You don't have pemission to access this route", 400)
    );
  }
  try {
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(verifyToken.id);
    req.user = user;
    next();
  } catch (error) {
    next(new HandleError("Invalid token", 400));
  }
});

exports.userRole = function (...roles) {
  return asyncWrapper(async function (req, res, next) {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      return next(
        new HandleError("You don't pemission to perform this task", 403)
      );
    }
  });
};

exports.forgetPassword = asyncWrapper(async function (req, res, next) {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new HandleError("Invalid email", 400));
  }
  const resetT = await user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}//${req.get(
      "host"
    )}/v1/api/auth/resetpassword/${resetT}`;

    const message = `Forget your password? Submit a patch request with your new password and confirm password to: ${resetURL}
    You didn't forget your password please ignore this email`;

    await sendMail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
    res.status(200).json({
      status: "Success",
      message,
    });
  } catch (error) {
    this.resetPasswordToken = undefined;
    this.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      staus: "Fail",
      message: "There was an error sending the email. Try again later",
    });
  }
});

exports.resetPassword = asyncWrapper(async function (req, res, next) {
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new HandleError("Invalid credential, please try again", 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenFn(user, 200, res);
});
