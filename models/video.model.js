const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
});

const Video = mongoose.model("video", videoSchema);

module.exports = Video;
