const User = require("../models/user");
const { BadRequest, Unauthenticated, NotFound } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");
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
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      lastName: user.lastName,
      location: user.location,
      email: user.email,
      token,
    },
  });
};
const update = async (req, res) => {
  console.log(req.user);
  const { id } = req.user;
  const user = await User.update(req.body, { where: { id: id } });
  const updatedUser = await User.findByPk(id);
  if (!user[0]) {
    throw new NotFound(`no user with id ${id}`);
  }
  // const token = user.Create
  res.status(StatusCodes.OK).json({
    user: {
      name: updatedUser.name,
      lastName: updatedUser.lastName,
      location: updatedUser.location,
      email: updatedUser.email,
    },
  });
};

module.exports = { login, register, update };
