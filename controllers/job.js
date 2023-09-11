const { StatusCodes } = require("http-status-codes");
const getAllJob = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "all job", user: req.user });
};
const getSingleJob = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "q job" });
};
const createJob = async (req, res) => {
  res.status(StatusCodes.CREATED).json({ msg: "create job" });
};
const updateJob = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "update job" });
};
const deleteJob = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "delete job" });
};
module.exports = { getAllJob, getSingleJob, createJob, updateJob, deleteJob };
