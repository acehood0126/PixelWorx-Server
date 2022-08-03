const express = require("express");
const router = express.Router();
const {
  getJobs,
  getJob,
  postJob,
  applyJob,
  deleteJob,
} = require("../controllers/jobController");

const { protectAuth } = require("../middleware/authMiddleware");

router.route("/").post(protectAuth, postJob);
router.route("/:currentpage/:jobcount").get(getJobs);
router.route("/:id").get(getJob).delete(deleteJob);
router.route("/apply").post(protectAuth, applyJob);

module.exports = router;
