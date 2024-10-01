const mongoose = require("mongoose");
const genreSchema = new mongoose.Schema({
  name: String,
  icon: String,
  linkedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movies" }],
});
const Genre = mongoose.model("Genre", genreSchema);
module.exports = Genre;
