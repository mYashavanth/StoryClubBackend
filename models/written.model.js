const mongoose = require("mongoose");

const writtenSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Written = mongoose.model("written", writtenSchema);

module.exports = Written;
