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
const courseRouter = require("./courseRouter");

const router = express.Router();

router.use("/:bootcampId/courses", courseRouter);
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router.route("/:id/photo").patch(uploadBootCampPhoto);

router.route("/").get(getAllBootCamps).post(createBootCamp);
router
  .route("/:id")
  .get(getBootCamp)
  .patch(UpdateBootCamp)
  .delete(deleteBootCamp);

module.exports = router;
