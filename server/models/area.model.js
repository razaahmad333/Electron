const mongoose = require("mongoose");

const Area = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  currentVoters: {
    type: Number,
    required: true,
  },
  votersHistory: {
    type: Array,
    required: true,
  },
  elections: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Area", Area);
