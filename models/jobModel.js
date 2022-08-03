const mongoose = require("mongoose");

const jobSchema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please add job title"],
    },
    type: {
      type: String,
      required: [true, "Please add job type"],
    },
    chain: {
      type: String,
      default: "ETH",
    },
    startDate: {
      type: Date,
      default: new Date(),
    },
    startImmediately: {
      type: Boolean,
      default: false,
    },
    salaryType: {
      type: String,
      default: "ETH",
    },
    paymentWay: {
      type: String,
      default: "Daily",
    },
    salary: {
      type: Number,
      default: 0,
    },
    description: {
      type: Object,
      required: true,
      default: "",
    },
    appliedDevs: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);
