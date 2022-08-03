const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const addUser = async ({
  name,
  address,
  designation,
  description,
  isDeveloper,
  timezone,
  resume,
  socials,
  avatar,
}) => {
  // Validation
  if (!address) {
    res.status(400);
    throw new Error("Please include all fields");
  }

  // Find if user already exist
  const userExist = await User.findOne({ address });

  if (userExist) {
    res.status(400);
    throw new Error("User already exist");
  }

  const user = await User.create({
    name,
    address,
    designation,
    timezone,
    description,
    isDeveloper,
    resume,
    socials,
    avatar,
  });

  return user;
};

// @desc    Login a user
// @route   /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { address } = req.body;

  // Find user
  let user = await User.findOne({ address });

  if (!user) {
    user = await addUser({
      address,
    });
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    designation: user.designation,
    address: user.address,
    timezone: user.timezone,
    description: user.description,
    isDeveloper: user.isDeveloper,
    resume: user.resume,
    avatar: user.avatar,
    socials: user.socials,
    token: generateToken(user._id),
  });
});

// @desc    Edit a user
// @route   /api/users/edit
// @access  Private
const editUser = asyncHandler(async (req, res) => {
  // Get user using the id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedUser);
});

// @desc    Get one user from id
// @route   GET /api/users/view/:id
// @access  public
const viewUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

module.exports = {
  loginUser,
  editUser,
  viewUser,
};
