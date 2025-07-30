const express = require("express");
const {
  getCourses,
  getOneCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("./../controllers/courseController");
const Course = require("../models/courseModel");
const { queryMidleware } = require("../middlewares/advancdQuery");

const router = express.Router({
  mergeParams: true,
});

router
  .route("/")
  .get(
    queryMidleware(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )

  .post(createCourse);
router.route("/:id").get(getOneCourse).patch(updateCourse).delete(deleteCourse);
module.exports = router;
