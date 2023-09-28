const User = require("../models/user");
const { BadRequest, Unauthenticated, NotFound } = require("../errors");

const { StatusCodes } = require("http-status-codes");
const { genSalt, hash } = require("bcryptjs");

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
  const token = user.token;
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      lastName: user.lastName,
      location: user.location,
      email: user.email,
      token: token,
    },
  });
};
const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.token;
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
  const { password } = req.body;
  if (password) {
    const salt = await genSalt(12);
    req.body.password = await hash(password, salt);
  }

  const user = await User.update(req.body, { where: { id: id } });
  const updatedUser = await User.findByPk(id);
  if (!user[0]) {
    throw new NotFound(`no user with id ${id}`);
  }
  const token = updatedUser.token;
  res.status(StatusCodes.OK).json({
    user: {
      name: updatedUser.name,
      lastName: updatedUser.lastName,
      location: updatedUser.location,
      email: updatedUser.email,
      token: token,
    },
  });
};

module.exports = { login, register, update };
