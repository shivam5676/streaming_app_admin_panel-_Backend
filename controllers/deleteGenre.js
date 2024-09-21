const Genre = require("../models/genre");

exports.deleteGenres = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  try {
    const deleteResponse = await Genre.findByIdAndDelete(id);
    if (deleteResponse) {
      return res.status(200).json({ msg: "Genre Deleted Successfully" });
    }
    return res.status(400).json({ msg: "could not delet the given genre" });
  } catch (err) {
    return res.status(400).json({ err });
  }
};
