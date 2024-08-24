const mongoose = require("mongoose");
const movieSchema = new mongoose.Schema({
  name: String,
  genre: String,
  layout: String,
  freeVideos: { type: Number, required: true },
  visible: { type: Boolean, required: true },
  thumbnail: String,
});
const Movies = mongoose.model("Movies", movieSchema);
module.exports = Movies;
