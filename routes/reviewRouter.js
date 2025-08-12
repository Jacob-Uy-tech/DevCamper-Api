const express = require("express");
const {
  getReviews,
  getSingleReview,
  addReview,
  updateReview,
  deleteReview,
} = require("./../controllers/reviewController");
const Review = require("../models/reviewModel");
const { queryMidleware } = require("../middlewares/advancdQuery");
const { protectedRoute, userRole } = require("./../controllers/auth");

const router = express.Router({
  mergeParams: true,
});

router
  .route("/")
  .get(
    queryMidleware(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protectedRoute, userRole("user", "admin"), addReview);

router
  .route("/:id")
  .get(getSingleReview)
  .patch(protectedRoute, userRole("user", "admin"), updateReview)
  .delete(protectedRoute, userRole("admin", "user"), deleteReview);
module.exports = router;
