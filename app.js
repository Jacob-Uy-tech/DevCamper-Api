const express = require("express");
const morgan = require("morgan");
const bootcampRouter = require("./routes/bootcampRouter");
const app = express();

app.use(express.json());
app.use(morgan());
app.use("/api/v1/bootcamps", bootcampRouter);

module.exports = app;
