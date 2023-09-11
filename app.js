require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("./db/connectDB");
const errorHandler = require("./middlewares/error-handler");
const notFound = require("./middlewares/not-found");
const auth = require("./routers/auth");
const app = express();
const port = process.env.PORT || 3000;
//middlewares
app.use(express.json());
//routes

//auth route
app.use("/api/v1/auth", auth);
//not found
app.use(notFound);
//error handler
app.use(errorHandler);
const start = async () => {
  try {
    await connectDB();
    app.listen(port, console.log(`server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
