const express = require("express");
const {
  getAllBootCamps,
  getBootCamp,
  createBootCamp,
  UpdateBootCamp,
  deleteBootCamp,
  getBootcampsInRadius,
  uploadBootCampPhoto,
} = require("./../controllers/bootcampController");
const { queryMidleware } = require("../middlewares/advancdQuery");
const courseRouter = require("./courseRouter");
const Bootcamp = require("../models/bootcampModel");
const { protectedRoute } = require("../controllers/auth");

const router = express.Router();

router.use("/:bootcampId/courses", courseRouter);
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router.route("/:id/photo").patch(uploadBootCampPhoto);

router
  .route("/")
  .get(queryMidleware(Bootcamp, "course"), getAllBootCamps)
  .post(createBootCamp);
router
  .route("/:id")
  .get(protectedRoute, getBootCamp)
  .patch(UpdateBootCamp)
  .delete(deleteBootCamp);

module.exports = router;
