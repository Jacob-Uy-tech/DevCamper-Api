const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const colors = require("colors");

dotenv.config({
  path: "./config/config.env",
});
const app = require("./app");

const PORT = process.env.PORT || 5000;
const DB = async function () {
  const db = await mongoose.connect(process.env.MONGO_DB_STRING);
  console.log(`${db.Connection}`.green.bold);
};

DB();

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .underline.bold
  )
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  //Close server & exit process
  server.close(() => process.exit(1));
});
