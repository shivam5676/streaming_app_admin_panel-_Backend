const Movies = require("../models/Movies");

exports.getAllMovies = async (req, res, next) => {
  try {
    const allMovies = await Movies.find()
    .populate({
      path: "layouts",
      select: "name ", // Only include 'name' and 'type' fields
    });
    // console.log(allMovies[0].layouts)
    return res.status(200).json({allMovies});
    
  } catch (err) {
    console.log(err);
  }
};
