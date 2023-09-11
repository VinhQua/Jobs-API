const jwt = require("jsonwebtoken");
const { Unauthenticated } = require("../errors");
const User = require("../models/user");
const authMiddleware = async (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    throw new Unauthenticated("Invalid Token");
  }
  const token = authHeaders.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findAll({
      attributes: { exclude: ["password"] },
      where: { id: decoded.userID },
    });
    req.user = user;
    next();
  } catch (error) {
    throw new Unauthenticated(`Invalid or Expired Token`);
  }
};

module.exports = authMiddleware;
