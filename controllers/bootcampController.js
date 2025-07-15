const Bootcamp = require("../models/bootcampModel");
const HandleError = require("./../Utilis/error");
const asyncWrapper = require("../middlewares/asyncHandler");

//@desc Get all bootcamps
//@route Get /api/v1/bootcamps
//@access Public

exports.getAllBootCamps = asyncWrapper(async function (req, res, next) {
  const bootcamp = await Bootcamp.find();
  if (!bootcamp) {
    return next(new HandleError("Bootcamps not found", 400));
  }

  res.status(200).json({
    status: "Success",
    count: bootcamp.length,
    data: bootcamp,
  });
});

//@desc Get single bootcamp
//@route Get /api/v1/bootcamps/:id
//@access Public
exports.getBootCamp = asyncWrapper(async function (req, res, next) {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new HandleError("Bootcamp not found", 400));
  }

  res.status(200).json({
    status: "Success",
    data: bootcamp,
  });
});

//@desc Update bootcamps
//@route Patch /api/v1/bootcamps/:id
//@access Private
exports.UpdateBootCamp = asyncWrapper(async function (req, res, next) {
  const UpdatedBootCamp = await Bootcamp.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!UpdatedBootCamp) {
    next(new HandleError("Bootcamp id not found", 400));
  }

  res.status(200).json({
    status: "Success",
    data: UpdatedBootCamp,
  });
});

//@desc Add new bootcamps
//@route Post /api/v1/bootcamps
//@access Private
exports.createBootCamp = asyncWrapper(async function (req, res, next) {
  if (!req.body) {
    return next(new HandleError("Bootcamp not created, try again", 400));
  }
  const bootCamp = await Bootcamp.create(req.body);
  res.status(201).json({
    status: "Success",
    data: bootCamp,
  });
});

//@desc Delete bootcamps
//@route Delete /api/v1/bootcamps/:id
//@access Private
exports.deleteBootCamp = asyncWrapper(async function (req, res, next) {
  const bootCamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootCamp) {
    return next(new HandleError("Bootcamp not deleted, try again", 400));
  }

  res.status(201).json({
    status: "Success",
    data: null,
  });
});

exports.getBootcampsInRadius = asyncWrapper(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
