const Genre = require("../models/genre");
const Movies = require("../models/Movies");

exports.getAllGenre = async (req, res, next) => {
  try {
    const allGenres = await Genre.find({},{_id:1,name:1})
    console.log(allGenres)
    
    return res.status(200).json({allGenres});
    
  } catch (err) {
    console.log(err); return res
    .status(500)
    .json({ msg: "something went wrong",err:err });
  }
};
