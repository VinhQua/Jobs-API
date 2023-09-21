const express = require("express");
const router = express.Router();
const { login, register, update } = require("../controllers/auth");
const authMiddleware = require("../middlewares/auth");
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/updateUser").patch(authMiddleware, update);
module.exports = router;
