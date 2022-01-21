const mongoose = require("mongoose");

const Election = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  conductedBy: {
    type: String,
    required: true,
  },
  parties: {
    type: Array,
    required: true,
  },
  areas: {
    type: Array,
    required: true,
  },
  partyData: {
    type: Array,
    required: true,
  },
  areaData: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Election", Election);
