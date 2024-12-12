const Movies = require("../models/Movies");

exports.addAds = async (req, res, next) => {
  console.log("hello ads", req.body);
  const { id } = req.body;
  try {
    const addMovieResponse = await Movies.findById(id);
    if(!addMovieResponse){
        return res.status(400).json({"msg":"Invalid data provide"})
    }
    // console.log(addMovieResponse);
    // return
    addMovieResponse.shorts.push("Ads");
    addMovieResponse.save();
    return res.status(200).json({"msg":"Ads added successfully"})
  } catch (error) {
    return res.status(500).json({"msg":"something went wrong",error})
  }
};
