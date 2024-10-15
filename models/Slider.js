const mongoose = require("mongoose");
const sliderSchema = new mongoose.Schema({
  schemaName: {type:String},
  type: String,
  linkedMovie: {type: mongoose.Schema.Types.ObjectId, ref: "Movies"},
  promotionalImageUrl:String,
  RedirectionLink:String,
  visible:Boolean
},{
  timestamps: true, // This adds createdAt and updatedAt automatically
});

const Slider=mongoose.model("Slider",sliderSchema)
module.exports=Slider
