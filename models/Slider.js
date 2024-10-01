const mongoose = require("mongoose");
const sliderSchema = new mongoose.Schema({
  schemaName: {type:String},
  type: String,
  linkedMovie: {type: mongoose.Schema.Types.ObjectId, ref: "Movies"},
  promotionalImageUrl:String,
  RedirectionLink:String,
  visible:Boolean
});

const Slider=mongoose.model("Slider",sliderSchema)
module.exports=Slider
