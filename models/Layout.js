const mongoose = require("mongoose");
const sliderSchema = new mongoose.Schema({
  name: String,
  Description: String,
  linkedMovies: Array,
});

const Layout = mongoose.model("Layout", sliderSchema);
module.exports = Layout;
