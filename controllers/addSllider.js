const Slider = require("../models/Slider");

exports.addSlider = async (req, res, next) => {
  // console.log(req.body);
  // console.log(req.file)
  // // we will upload the file on tencent and then we will save the url in db if no file is present then we will check linked url and save it else we will gieve an err
  // return
  try {
    const { name, type, movieId,visible } = req.body;
    const sliderResponse = await Slider.create({
      schemaName: name,
      type: type,
      linkedMovie: movieId,
      visible
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
