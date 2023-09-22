const { StatusCodes } = require("http-status-codes");
const Job = require("../models/job");
const { NotFound, BadRequest } = require("../errors");
const User = require("../models/user");
const getAllJob = async (req, res) => {
  const UserId = req.user.id;
  const jobs = await Job.findAll({
    include: {
      model: User,
      attributes: { exclude: ["password", "token", "updatedAt"] },
    },
    where: { UserId },
  });
  res.status(StatusCodes.OK).json({ success: true, amount: jobs.length, jobs });
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
