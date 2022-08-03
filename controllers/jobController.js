const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Job = require("../models/jobModel");
const ObjectId = mongoose.Types.ObjectId;

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
  const currentpage = req.params.currentpage;
  const jobcount = req.params.jobcount;

  const skipcount = currentpage == -1 ? 0 : currentpage * jobcount;
  const limitcount = jobcount == -1 ? Number.MAX_SAFE_INTEGER : jobcount * 1;

  const total = await Job.countDocuments();

  const jobs = await Job.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userid",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    { $skip: skipcount },
    { $limit: limitcount },
  ]);

  res.status(200).json({ jobs, total });
});

// @desc    Get one job from id
// @route   GET /api/job/:id
// @access  public
const getJob = asyncHandler(async (req, res) => {
  const job = await Job.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userid",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $match: {
        _id: ObjectId(req.params.id),
      },
    },
  ]);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  res.status(200).json(job[0]);
});

// @desc    Apply job
// @route   POST /api/jobs/apply
// @access  private
const applyJob = asyncHandler(async (req, res) => {
  // Get user using the id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const job = await Job.findById(req.body.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  let appliedDevs = Array.isArray(job?.appliedDevs) ? job.appliedDevs : [];
  let index = appliedDevs.findIndex((v) => v.address === user.address);
  if (index != -1) {
    res.status(401);
    throw new Error("This user was already applied.");
  }

  appliedDevs.push(user);

  await Job.findByIdAndUpdate(
    req.body.id,
    { appliedDevs: appliedDevs },
    { new: true }
  );

  res.status(200).json(job);
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(401);
    throw new Error("The job is not exist");
  }
  try {
    await Job.deleteOne({ _id: ObjectId(req.params.id) });
    res.status(200).json({ msg: "Successfully deleted" });
  } catch {
    res.status(401);
    throw new Error("Can't connect to database");
  }
});

// @desc    Post new job
// @route   POST /api/jobs
// @access  Private
const postJob = asyncHandler(async (req, res) => {
  const {
    title,
    type,
    chain,
    startDate,
    startImmediately,
    salaryType,
    paymentWay,
    salary,
    description,
  } = req.body;

  if (!title || !type || !chain) {
    res.status(400);
    throw new Error("Please add information");
  }

  // Get user using the id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // if (user.isDeveloper) {
  //   res.status(401);
  //   throw new Error("This user is not business man.");
  // }

  const job = await Job.create({
    userid: user._id,
    title,
    type,
    chain,
    startDate,
    startImmediately,
    salaryType,
    paymentWay,
    salary,
    description,
  });

  res.status(201).json(job);
});

module.exports = {
  getJobs,
  getJob,
  postJob,
  applyJob,
  deleteJob,
};
