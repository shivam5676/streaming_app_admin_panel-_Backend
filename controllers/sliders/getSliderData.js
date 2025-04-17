const Slider = require("../../models/Slider");

exports.getSliderData = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Slider.findById(id).populate({
      path: "linkedMovies",
      select: "_id name",
    });
    if (!response) {
      return res.status(400).json({ Slider: [] });
    }
    return res.status(200).json({ Slider: response });
  } catch (error) {
    return res.status(400).json({ err: error });
  }
};
