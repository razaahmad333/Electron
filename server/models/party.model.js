const mongoose = require("mongoose");

const Party = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  leader: {
    type: String,
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

module.exports = mongoose.model("Party", Party);
