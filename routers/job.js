const express = require("express");
const router = express.Router();
const {
  getAllJob,
  getSingleJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/job");
router.route("/").get(getAllJob).post(createJob);
router.route("/:id").get(getSingleJob).patch(updateJob).delete(deleteJob);
module.exports = router;
