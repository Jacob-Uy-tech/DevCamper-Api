const HandleError = require("./../Utilis/error");
const asyncWrapper = require("../middlewares/asyncHandler");
const User = require("../models/userModel");

exports.getUsers = asyncWrapper(async function (req, res, next) {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: users,
  });
});

exports.getMe = asyncWrapper(async function (req, res, next) {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: "Success",
    user,
  });
});
