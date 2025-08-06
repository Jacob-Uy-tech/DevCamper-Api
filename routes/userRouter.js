const express = require("express");
const router = express.Router();
const { getUsers, getMe } = require("../controllers/userController");
const { protectedRoute } = require("../controllers/auth");

router.route("/").get(getUsers);
router.route("/me").get(protectedRoute, getMe);

module.exports = router;
