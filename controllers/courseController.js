const Course = require("./../models/courseModel");
const HandleError = require("./../Utilis/error");
const asyncWrapper = require("../middlewares/asyncHandler");
const Bootcamp = require("../models/bootcampModel");

//@desc Get Allcourse bootcamps
//@route Get Allcourse /api/v1/bootcamp/:bootcampid/course
//@access public

exports.getCourses = asyncWrapper(async function (req, res, next) {
  if (req.params.bootcampId) {
    const course = await Course.find({ bootcamp: req.params.bootcampId });
    res.status(200).json({
      status: "Success",
      count: course.length,
      data: course,
    });
  } else {
    res.status(200).json({
      result: res.advancedQuery,
    });
  }
});

//@desc Get one course bootcamps
//@route Get one course /api/v1/courses/:id
//@access public
exports.getOneCourse = asyncWrapper(async function (req, res, next) {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    return next(new HandleError("Course id not found", 404));
  }
  res.status(200).json({
    status: "Success",
    data: course,
  });
});

//@desc Add course
//@route Post one course /api/v1/bootcamps/bootcamp:id/courses
//@access private
exports.createCourse = asyncWrapper(async function (req, res, next) {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(new HandleError("Bootcamp id not found", 404));
  }
  if (
    bootcamp.user.id.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(
      new HandleError("You don't have pemission to perform this task", 401)
    );
  }
  const course = await Course.create(req.body);

  res.status(200).json({
    status: "Success",
    data: course,
  });
});
//@desc Update course
//@route Patch  course /api/v1/courses/:id
//@access private
exports.updateCourse = asyncWrapper(async function (req, res, next) {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(new HandleError("Course id not found", 404));
  }
  if (course.user.id.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new HandleError("You don't have pemission to perform this task", 401)
    );
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "Success",
    data: course,
  });
});
//@desc Update course
//@route Patch  course /api/v1/courses/:id
//@access private
exports.deleteCourse = asyncWrapper(async function (req, res, next) {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new HandleError("Course id not found", 404));
  }
  if (course.user.id.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new HandleError("You don't have pemission to perform this task", 401)
    );
  }
  await Course.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "Success",
    data: null,
  });
});
