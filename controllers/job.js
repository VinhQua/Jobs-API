const { StatusCodes } = require("http-status-codes");
const Job = require("../models/job");
const { NotFound, BadRequest } = require("../errors");
const User = require("../models/user");
const { Op } = require("sequelize");
const getAllJob = async (req, res) => {
  let queryObject = { UserId: req.user.id };
  const { status, position, search, company, sort } = req.query;
  //Filters
  if (status !== "all") {
    queryObject.status = { [Op.iLike]: `%${status}%` };
  }
  if (position !== "all") {
    queryObject.position = { [Op.iLike]: `%${position}%` };
  }
  // if (search) {
  //   queryObject.search = { [Op.iLike]: `%${search}%` };
  // }
  if (company !== "all") {
    queryObject.company = { [Op.iLike]: `%${company}%` };
  }
  //sort
  let sortList = [];
  if (sort) {
    sortList = [["company", "ASC"]];
  }
  //page
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;

  const { count, rows } = await Job.findAndCountAll({
    // include: {
    //   model: User,
    //   attributes: { exclude: ["password", "token", "updatedAt"] },
    // },
    limit: limit,
    offset: (page - 1) * 10,
    where: queryObject,
    order: sortList,
  });
  const totalPages = Math.ceil(count / limit);
  res.status(StatusCodes.OK).json({
    success: true,
    totalAmount: count,
    totalPages: totalPages,
    limit: limit,
    jobs: rows,
  });
};
const getSingleJob = async (req, res) => {
  const {
    params: { id: JobId },
    user: { id: UserId },
  } = req;
  const job = await Job.findOne({ where: { id: JobId, UserId } });
  if (!job) {
    throw new NotFound(`No job with id ${JobId}`);
  }
  res.status(StatusCodes.OK).json({ success: true, job });
};
const createJob = async (req, res) => {
  req.body.UserId = req.user.id;
  if (req.body.length > 1) {
    const jobs = await Job.bulkCreate([...req.body]);
    return res.status(StatusCodes.CREATED).json({ success: true, jobs });
  }
  const job = await Job.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ success: true, job });
};
const updateJob = async (req, res) => {
  const {
    body: { company, position },
    params: { id: JobId },
    user: { id: UserId },
  } = req;
  const job = await Job.update(
    { ...req.body },
    { where: { id: JobId, UserId } }
  );
  if (!company && !position) {
    throw new BadRequest("Please provide company or/and position");
  }
  if (!job[0]) {
    throw new NotFound(`No job with id ${JobId}`);
  }
  res.status(StatusCodes.OK).json({ success: true, job });
};
const deleteJob = async (req, res) => {
  const {
    params: { id: JobId },
    user: { id: UserId },
  } = req;
  const job = await Job.destroy({ where: { id: JobId, UserId } });
  if (!job) {
    throw new NotFound(`No job with id ${JobId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "job deleted" });
};
module.exports = { getAllJob, getSingleJob, createJob, updateJob, deleteJob };
