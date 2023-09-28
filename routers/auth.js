const express = require("express");
const router = express.Router();
const { login, register, update } = require("../controllers/auth");
const authMiddleware = require("../middlewares/auth");

const rateLimiter = require("express-rate-limit");
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    msg: `too many requests from this IP, Please try again after 15 minutes`,
  },
});
router.route("/login").post(apiLimiter, login);
router.route("/register").post(apiLimiter, register);
router.route("/updateUser").patch(authMiddleware, update);
module.exports = router;
