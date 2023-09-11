const User = require("../models/user");
const { BadRequest, Unauthenticated } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("Please provide email and password");
  }
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Unauthenticated("Wrong email");
  }
  const isCorrectPassword = user.authenticate(password);
  if (!isCorrectPassword) {
    throw new Unauthenticated("Wrong password");
  }
  const token = jwt.sign(
    { userID: user.id, userName: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
  res.status(StatusCodes.OK).json({ userName: user.name, token });
};
const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = jwt.sign(
    { userID: user.id, userName: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
  res.status(StatusCodes.CREATED).json({ userName: user.name, token });
};
module.exports = { login, register };