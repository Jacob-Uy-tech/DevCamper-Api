const express = require("express");
const {
  getAllBootCamps,
  getBootCamp,
  createBootCamp,
  UpdateBootCamp,
  deleteBootCamp,
} = require("./../controllers/bootcampController");

const router = express.Router();

router.route("/").get(getAllBootCamps).post(createBootCamp);
router
  .route("/:id")
  .get(getBootCamp)
  .patch(UpdateBootCamp)
  .delete(deleteBootCamp);

module.exports = router;
