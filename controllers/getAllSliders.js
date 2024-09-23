const Slider = require("../models/Slider");

exports.getAllSliders = async (req, res) => {
  try {
    const response = await Slider.find().populate("linkedMovie");
    if(!response){
      return res.status(200).json({ Slider: [] });
    }
    return res.status(200).json({ Slider: response });
  } catch (error) {
    return res.status(400).json({ err:error });
  }
};
