const express = require("express");
const router = express.Router();
const testUser = require("../middlewares/testUser");
const {
  getAllJob,
  getSingleJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
} = require("../controllers/job");
router.route("/").get(getAllJob).post(testUser, createJob);
router.route("/showStats").get(showStats);
router
  .route("/:id")
  .get(getSingleJob)
  .patch(testUser, updateJob)
  .delete(testUser, deleteJob);

module.exports = router;
