const Slider = require("../models/Slider");

exports.addSlider = async (req, res, next) => {
    console.log(req.body)
  try {
    const { name, type, movieId } = req.body;
    const sliderResponse = await Slider.create({
      schemaName: name,
      type: type,
      linkedMovie: movieId,
    });
    console.log(sliderResponse);
  } catch (err) {
    console.log(err);
  }
};
