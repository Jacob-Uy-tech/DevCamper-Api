const express = require("express");
const {
  getCourses,
  getOneCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("./../controllers/courseController");

const router = express.Router({
  mergeParams: true,
});

router.route("/").get(getCourses).post(createCourse);
router.route("/:id").get(getOneCourse).patch(updateCourse).delete(deleteCourse);
module.exports = router;
