const { StatusCodes } = require("http-status-codes");
const Job = require("../models/job");
const { NotFound, BadRequest } = require("../errors");
const User = require("../models/user");
const { Op } = require("sequelize");
const { sequelize } = require("../db/connectDB");
const moment = require("moment/moment");
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
const showStats = async (req, res) => {
  const UserId = req.user.id;
  let stats = await Job.findAll({
    group: ["status"],
    attributes: ["status", [sequelize.fn("COUNT", "status"), "count"]],
    where: { UserId: UserId },
  });

  stats = stats.reduce((acc, curr) => {
    const { status, count } = curr.dataValues;

    acc[status] = Number(count);
    return acc;
  }, {});

  let monthLyApplications = await Job.findAll({
    where: {
      UserId: UserId,
    },
    order: [["month", "DESC"]],
    attributes: [
      [sequelize.fn("DATE_TRUNC", "year", sequelize.col("createdAt")), "year"],
      [
        sequelize.fn("DATE_TRUNC", "month", sequelize.col("createdAt")),
        "month",
      ],
      [sequelize.literal(`COUNT(*)`), "count"],
    ],
    group: ["month", "year"],
  });

  monthLyApplications = monthLyApplications
    .map((item) => {
      let { year, month, count } = item.dataValues;
      year = year.getFullYear();
      month = month.getMonth();
      const date = moment().month(month).year(year).format("MMM Y");
      return { date, count };
    })
    .slice(0, 6)
    .reverse();
  res.status(StatusCodes.OK).json({ stats, monthLyApplications });
};

module.exports = {
  showStats,
  getAllJob,
  getSingleJob,
  createJob,
  updateJob,
  deleteJob,
};
