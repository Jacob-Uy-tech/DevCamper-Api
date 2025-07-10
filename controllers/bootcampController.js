const Bootcamp = require("../models/bootcampModel");

//@desc Get all bootcamps
//@route Get /api/v1/bootcamps
//@access Public

exports.getAllBootCamps = async function (req, res, next) {
  try {
    const bootcamp = await Bootcamp.find();
    if (!bootcamp) {
      return res.status(400).json({
        status: "Fail",
      });
    }

    res.status(200).json({
      status: "Success",
      count: bootcamp.length,
      data: bootcamp,
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};

//@desc Get single bootcamp
//@route Get /api/v1/bootcamps/:id
//@access Public
exports.getBootCamp = async function (req, res, next) {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res.status(400).json({
        status: "Fail",
      });
    }

    res.status(200).json({
      status: "Success",
      data: bootcamp,
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};

//@desc Update bootcamps
//@route Patch /api/v1/bootcamps/:id
//@access Private
exports.UpdateBootCamp = async function (req, res, next) {
  try {
    const UpdatedBootCamp = await Bootcamp.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!UpdatedBootCamp) {
      return res.status(400).json({
        status: "Fail",
      });
    }

    res.status(200).json({
      status: "Success",
      data: UpdatedBootCamp,
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};

//@desc Add new bootcamps
//@route Post /api/v1/bootcamps
//@access Private
exports.createBootCamp = async function (req, res, next) {
  try {
    const bootCamp = await Bootcamp.create(req.body);
    if (!bootCamp) {
      return res.status(400).json({
        status: "Fail",
      });
    }
    res.status(201).json({
      status: "Success",
      data: bootCamp,
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};

//@desc Delete bootcamps
//@route Delete /api/v1/bootcamps/:id
//@access Private
exports.deleteBootCamp = async function (req, res, next) {
  try {
    const bootCamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootCamp) {
      return res.status(400).json({
        status: "Fail",
      });
    }

    res.status(201).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};
