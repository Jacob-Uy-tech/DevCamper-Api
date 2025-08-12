const express = require("express");
const { protectedRoute, userRole } = require("./../controllers/auth");
const {
  register,
  login,
  forgetPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  getMe,
  logout,
} = require("../controllers/auth");

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectedRoute, getMe);
router.post("/forgetpassword", forgetPassword);
router.patch("/resetpassword/:resettoken", resetPassword);
router.patch("/updatedetails", protectedRoute, updateDetails);
router.patch("/updatepassword", protectedRoute, updatePassword);

module.exports = router;
