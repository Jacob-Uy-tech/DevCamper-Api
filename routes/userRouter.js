const express = require("express");
const router = express.Router();
const {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protectedRoute, userRole } = require("../controllers/auth");
const { queryMidleware } = require("../middlewares/advancdQuery");
const User = require("../models/userModel");

router.use(protectedRoute);
router.use(userRole("admin"));
router.route("/").get(queryMidleware(User), getUsers).post(createUser);
router.route("/:id").get(getOneUser).patch(updateUser).delete(deleteUser);

module.exports = router;
