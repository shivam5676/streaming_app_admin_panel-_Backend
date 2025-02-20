const Slider = require("../models/Slider");

exports.getAllSliders = async (req, res) => {
  const { start, limit } = req.params;
  console.log(start, limit);
  try {
    const totalSliders = await Slider.countDocuments();
    const response = await Slider.find()
      .populate("linkedMovie")
      .skip(limit * start)
      .limit(limit);
    if (!response) {
      return res.status(200).json({ Slider: [] });
    }
    return res.status(200).json({ Slider: response });
  } catch (error) {
    return res.status(400).json({ err: error });
  }
};
