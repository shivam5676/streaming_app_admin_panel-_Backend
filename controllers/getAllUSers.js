const Movies = require("../models/Movies");
const Users = require("../models/Users");

exports.getAllUsers = async (req, res, next) => {
  try {
    const allMovies = await Users.find().select("name email")
    // .populate([
    //   {
    //     path: "layouts",
    //     select: "name ", // Only include 'name' and 'type' fields
    //   },
    //   {
    //     path: "genre",
    //     select: "name ", // Only include 'name' and 'type' fields
    //   },
    // ]);
    // console.log(allMovies[0].layouts)
    return res.status(200).json({ allMovies });
    
  } catch (err) {
    console.log(err);
  }
};
