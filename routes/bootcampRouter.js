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
const { protectedRoute, userRole } = require("./../controllers/auth");

const router = express.Router();

router.use("/:bootcampId/courses", courseRouter);
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router
  .route("/:id/photo")
  .patch(protectedRoute, userRole("publisher", "admin"), uploadBootCampPhoto);

router
  .route("/")
  .get(queryMidleware(Bootcamp, "course"), getAllBootCamps)
  .post(protectedRoute, userRole("publisher", "admin"), createBootCamp);
router
  .route("/:id")
  .get(protectedRoute, getBootCamp)
  .patch(protectedRoute, userRole("publisher", "admin"), UpdateBootCamp)
  .delete(protectedRoute, userRole("publisher", "admin"), deleteBootCamp);

module.exports = router;
