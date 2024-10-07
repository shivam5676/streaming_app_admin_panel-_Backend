const Users = require("../models/Users");

exports.getUserDetails = async (req, res, next) => {
  const { id } = req.body;
  try {
    const userDetails = await Users.findOne({ _id: id },{password:0}).populate({
        path: "selectedGenre",
        select: "name _id", // Include only name and _id fields
      })
      .populate({
        path: "selectedLanguages",
        select: "name _id", // Include only name and _id fields
      })
    console.log(userDetails);
    return res.status(200).json({ userDetails });
  } catch (err) {
    console.log(err);
  }
};
