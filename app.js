const express = require("express");
const morgan = require("morgan");
const bootcampRouter = require("./routes/bootcampRouter");
const errorHandler = require("./middlewares/middles");
const app = express();

app.use(express.json());
app.use(morgan());
app.use("/api/v1/bootcamps", bootcampRouter);
app.use(errorHandler);

module.exports = app;
