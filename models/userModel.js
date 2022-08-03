const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    isDeveloper: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      unique: true,
    },
    designation: {
      type: String,
      default: "",
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    description: {
      type: Array,
      default: ["", ""],
    },
    resume: {
      type: Object,
      default: {},
    },
    socials: {
      type: Array,
      default: [{}, {}],
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
