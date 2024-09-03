const mongoose = require("mongoose");
const movieSchema = new mongoose.Schema({
  name: String,
  genre: String,
  layout: String,
  freeVideos: { type: Number, required: true },
  visible: { type: Boolean, required: true },
  fileLocation: String,
  shorts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shorts" }],
  layouts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Layout" }],
});
const Movies = mongoose.model("Movies", movieSchema);
module.exports = Movies;
