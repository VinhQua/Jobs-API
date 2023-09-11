require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("./db/connectDB");
const app = express();
const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB();
    app.listen(port, console.log(`server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
