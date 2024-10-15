const mongoose = require("mongoose");
const genreSchema = new mongoose.Schema(
  {
    name: String,
    icon: String,
    linkedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movies" }],
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  }
);
const Genre = mongoose.model("Genre", genreSchema);
module.exports = Genre;
