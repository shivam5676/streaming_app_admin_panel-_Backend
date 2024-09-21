const Genre = require("../models/genre");
const Movies = require("../models/Movies");

exports.getAllGenre = async (req, res, next) => {
  try {
    const allGenres = await Genre.find()
    
    
    return res.status(200).json({allGenres});
    
  } catch (err) {
    console.log(err);
  }
};
