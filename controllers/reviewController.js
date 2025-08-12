const Bootcamp = require("../models/bootcampModel");
const Review = require("../models/reviewModel");
const HandleError = require("./../Utilis/error");
const asyncWrapper = require("../middlewares/asyncHandler");

//@desc Get AllReviews from bootcamps
//@route Get AllReview /api/v1/bootcamp/:bootcampid/review
//@access public

exports.getReviews = asyncWrapper(async function (req, res, next) {
  const bootCamp = await Review.findOne({ bootCamp: req.params.bootcampid });

  if (req.params.bootcampid) {
    res.status(200).json({
      status: "Success",
      count: bootCamp.length,
      data: bootCamp,
    });
  } else {
    res.status(200).json({
      result: res.advancedQuery,
    });
  }
});

//@desc Get single review
//@route Get single review /api/v1/review/:id
//@access private
exports.getSingleReview = asyncWrapper(async function (req, res, next) {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!review) {
    return next(new HandleError("Course id not found", 404));
  }
  res.status(200).json({
    status: "Success",
    data: review,
  });
});

//@desc Create review from bootcamp
//@route Post review /api/v1/bootcamp/bootcamp:id/review
//@access private

exports.addReview = asyncWrapper(async function (req, res, next) {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootCamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootCamp) {
    return next(
      new HandleError(`You don't have pemission to perform this task`, 404)
    );
  }
  const newReview = await Review.create(req.body);
  res.status(200).json({
    status: "Success",
    newReview,
  });
});

//@desc  Update revieU from bootcamp
//@route Patch review /api/v1/review/:id
//@access private

exports.updateReview = asyncWrapper(async function (req, res, next) {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new HandleError(
        new HandleError(`No review with id ${req.params.id} found`, 404)
      )
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new HandleError(`You don't have pemission to perform this task`, 401)
    );
  }
  const updatedReview = await Review.findByIdAndDelete(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "Success",
    updatedReview,
  });
});

//@desc  Delete review from bootcamp
//@route Delete review /api/v1/review/:id
//@access private

exports.deleteReview = asyncWrapper(async function (req, res, next) {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new HandleError(
        new HandleError(`No review with id ${req.params.id} found`, 404)
      )
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new HandleError(`You don't have pemission to perform this task`, 401)
    );
  }
  await Review.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "Success",
    data: null,
  });
});
