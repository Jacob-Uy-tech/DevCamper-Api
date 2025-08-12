const HandleError = require("./../Utilis/error");
const asyncWrapper = require("../middlewares/asyncHandler");
const User = require("../models/userModel");

exports.getUsers = asyncWrapper(async function (req, res, next) {
  res.status(200).json({
    status: "success",
    data: res.advancedQuery,
  });
});

exports.getOneUser = asyncWrapper(async function (req, res, next) {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: "Success",
    data: user,
  });
});

exports.createUser = asyncWrapper(async function (req, res, next) {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "Success",
    data: newUser,
  });
});

exports.updateUser = asyncWrapper(async function (req, res, next) {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "Success",
    data: updatedUser,
  });
});

exports.deleteUser = asyncWrapper(async function (req, res, next) {
  const deleteUser = await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "Success",
    data: null,
  });
});
