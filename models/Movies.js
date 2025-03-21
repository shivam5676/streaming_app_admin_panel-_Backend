const mongoose = require("mongoose");
const Language = require("./language");
const movieSchema = new mongoose.Schema(
  {
    name: String,
    genre: String,
    layout: String,
    freeVideos: { type: Number, required: true },
    visible: { type: Boolean, required: true },
    fileLocation: String,
    shorts: [{ type: mongoose.Schema.Types.Mixed, ref: "Shorts" }],
    shortsJobs: [{ type: mongoose.Schema.Types.Mixed }],
    layouts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Layout" }],
    genre: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
    language: [{ type: mongoose.Schema.Types.ObjectId, ref: "Language" }],
    trailerUrl: String,
    trailerUrlFileId: String,
    parts: Number,
    views: { type: Number, default: 0 },
    low: String,
    medium: String,
    high: String,
    licenseExpiry: String,
    screenType: String,
  },

  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  }
);
const Movies = mongoose.model("Movies", movieSchema);
module.exports = Movies;
