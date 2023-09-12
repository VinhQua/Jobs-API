const { StatusCodes } = require("http-status-codes");
const Job = require("../models/job");
const getAllJob = async (req, res) => {
  const UserId = req.user.id;
  const jobs = await Job.findAll({ include: "User", where: { UserId } });
  res.status(StatusCodes.OK).json({ success: true, amount: jobs.length, jobs });
};
const getSingleJob = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "q job" });
};
const createJob = async (req, res) => {
  req.body.UserId = req.user.id;

  console.log(req.body);
  const job = await Job.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ success: true, job });
};
const updateJob = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "update job" });
};
const deleteJob = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "delete job" });
};
module.exports = { getAllJob, getSingleJob, createJob, updateJob, deleteJob };
