require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("./db/connectDB");
const errorHandler = require("./middlewares/error-handler");
const notFound = require("./middlewares/not-found");
const authMiddleware = require("./middlewares/auth");
const auth = require("./routers/auth");
const job = require("./routers/job");
const app = express();
//Swagger UI

const swaggerUI = require("swagger-ui-express");
const yaml = require("yamljs");
const SwaggerDocs = yaml.load("./swagger.yaml");
//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const port = process.env.PORT || 3000;
app.set("trust proxy", true);
//middlewares
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: "draft-7", // Set `RateLimit` and `RateLimit-Policy` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // store: ... , // Use an external store for more precise rate limiting
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
//API DOCS
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(SwaggerDocs));
//routes
app.get("/", (req, res) =>
  res.send(`  <h1>Jobs API <a href="api-docs"> Documentation </a> </h1>`)
);
//auth route
app.use("/api/v1/auth", auth);
//job route
app.use("/api/v1/jobs", authMiddleware, job);
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
