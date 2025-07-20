const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bootcampRouter = require("./routes/bootcampRouter");
const courseRouter = require("./routes/courseRouter");
const errorHandler = require("./middlewares/middles");
const fileupload = require("express-fileupload");

const app = express();

app.use(express.json());
app.use(morgan());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileupload());
app.use("/api/v1/bootcamps", bootcampRouter);
app.use("/api/v1/courses", courseRouter);
app.use(errorHandler);

module.exports = app;
