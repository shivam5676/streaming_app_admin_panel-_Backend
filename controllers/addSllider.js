const Slider = require("../models/Slider");

exports.addSlider = async (req, res, next) => {
  // console.log(req.body);
  // console.log(req.file)
  // // we will upload the file on tencent and then we will save the url in db if no file is present then we will check linked url and save it else we will gieve an err
  // return
  const { PromotionalImageURL, promotionalContentType } = req.body;
  if (promotionalContentType == "URL" && PromotionalImageURL.length == 0) {
    return res.status(400).json({
      msg: "No Url present for linking promotional content",
      status: false,
    });
  }
  //we will add other checking for other conttent type too
  try {
    const { name, type, movieId, visible } = req.body;
    if (!name || name.length == 0) {
      return res
        .status(404)
        .json({ msg: "Please provide Slider name", status: false });
    }
    if (!type || type.length == 0) {
      return res
        .status(404)
        .json({ msg: "Please select content type", status: false });
    }
    if (type == "Trailer" && (!movieId || movieId.length == 0)) {
      return res.status(404).json({
        msg: "Please select movie for linking to this slider",
        status: false,
      });
    }
    const sliderResponse = await Slider.create({
      schemaName: name,
      type: type,
      linkedMovie: movieId,
      visible,
    });
    if (type == "Promotional") {
      return res.status(400).json({
        msg: "Promotional slider is not accepting new slider ...",
        success: false,
      });
    }
    if (type == "Redirection") {
      return res.status(400).json({
        msg: "Redirection is not accepting new slider ...",
        success: false,
      });
    }
    console.log(sliderResponse);
    if (!sliderResponse) {
      return res.status(400).json({
        msg: "there was some problem while saving ur slider....try after sometime",
        success: false,
      });
    }
    return res.status(200).json(sliderResponse);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ msg: "something went wrong...", success: false });
  }
};
