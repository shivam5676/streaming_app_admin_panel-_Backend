const Movies = require("../models/Movies");

modeule.exports = (req, res, next) => {
  try {
    const { objId } = req.body;
    const response = Movies.findOneAndDelete({ _id: objId });
  } catch (err) {
    return res.status(400).json({ msg: "something went wrong" });
  }
};
