const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    required: true,
    type: Number,
  }
});

module.exports = ratingSchema;
