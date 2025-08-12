const path = require("path");
const Bootcamp = require("../models/bootcampModel");
const HandleError = require("./../Utilis/error");
const asyncWrapper = require("../middlewares/asyncHandler");

//@desc Get all bootcamps
//@route Get /api/v1/bootcamps
//@access Public

exports.getAllBootCamps = asyncWrapper(async function (req, res, next) {
  res.status(200).json({
    result: res.advancedQuery,
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
  const { id } = req.user;
  const realUser = await Bootcamp.findById(req.params.id);

  if (id !== realUser.user.toString() && req.user.role !== "admin") {
    return next(
      new HandleError("You don't have pemission to perform this task", 401)
    );
  }
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
  req.body.user = req.user.id;
  const publishedBootcamp = await Bootcamp.findOne({
    user: req.user.id,
  });

  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new HandleError(`${req.user.role} can only create one bootcamp`, 400)
    );
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
  const { id } = req.user;
  const realUser = await Bootcamp.findById(req.params.id);

  if (id !== realUser.user.toString() && req.user.role !== "admin") {
    return next(
      new HandleError("You don't have pemission to perform this task", 401)
    );
  }

  const bootCamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootCamp) {
    return next(new HandleError("Bootcamp id not found, try again", 400));
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

//@desc Upload bootcamp photo
//@route Update /api/v1/bootcamps/:id/photo
//@access Private
exports.uploadBootCampPhoto = asyncWrapper(async function (req, res, next) {
  const bootCamp = await Bootcamp.findById(req.params.id);
  if (!bootCamp) {
    return next(new HandleError("Bootcamp id not found, try again", 400));
  }
  // console.log(`Hello world`);

  if (!req.files) {
    return next(new HandleError("Please upload a file", 400));
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    return next(new HandleError("Please upload a valid image", 400));
  }

  if (file.size > process.MAX_IMAGE_SIZE) {
    return next(
      new HandleError(
        `Image size should be less than ${process.MAX_IMAGE_SIZE}`,
        400
      )
    );
  }

  file.name = `photo_${bootCamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.BOOTCAMP_FILE_PATH}/${file.name}`, async (err) => {
    if (err) {
      return next(new HandleError(`Problem with file upload `, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,

      data: file.name,
    });
  });
});
