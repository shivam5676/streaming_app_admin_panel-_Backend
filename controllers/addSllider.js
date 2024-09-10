const Slider = require("../models/Slider");

exports.addSlider = async (req, res, next) => {
  console.log(req.body);
  try {
    const { name, type, movieId } = req.body;
    const sliderResponse = await Slider.create({
      schemaName: name,
      type: type,
      linkedMovie: movieId,
    });
    console.log(sliderResponse);
    if (!sliderResponse) {
      return res
        .status(400)
        .json({
          msg: "there was some problem while saving ur slider....try after sometime",
        });
    }
    return res.status(200).json(sliderResponse);
  } catch (err) {
    console.log(err);
  }
};
