const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bootcampRouter = require("./routes/bootcampRouter");
const courseRouter = require("./routes/courseRouter");
const reviewRouter = require("./routes/reviewRouter");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const errorHandler = require("./middlewares/middles");
const fileupload = require("express-fileupload");
const { request } = require("http");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(morgan());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileupload());
app.use("/api/v1/bootcamps", bootcampRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use(errorHandler);

module.exports = app;
