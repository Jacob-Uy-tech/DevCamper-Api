const express = require("express");
const {
  register,
  login,
  forgetPassword,
  resetPassword,
} = require("../controllers/auth");

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/forgetpassword", forgetPassword);
router.patch("/resetpassword/:resettoken", resetPassword);

module.exports = router;
