
const Slider = require("../models/Slider");

exports.getAllSliders = async (req, res) => {
  const response = await Slider.find().populate("linkedMovie")
  return res.status(200).json({ Slider: response });
};
