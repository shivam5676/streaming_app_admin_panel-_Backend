const mongoose = require("mongoose");
const sliderSchema = new mongoose.Schema({
  schemaName: String,
  type: String,
  linkedMovie: String,
});

const Slider=mongoose.model("Slider",sliderSchema)
module.exports=Slider
