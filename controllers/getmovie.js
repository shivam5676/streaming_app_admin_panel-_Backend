const Movies = require("../models/Movies");
const Shorts = require("../models/Shorts");

exports.getmovie = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await Movies.findById(id)
      .populate([
        // { path: "shorts" },
        { path: "layouts", select: "name _id" },
        { path: "genre", select: "name _id" },
        { path: "language", select: "name _id" },
      ])
      .exec();
    console.log(response);
    const shortArrayPromises = response.shorts.map(async (current) => {
      if (current === "Ads") {
        return current;
      }
      const short = await Shorts.findOne({ _id: current }).lean();
      console.log(short, "....short");
      return short;
    });
    const shorts = await Promise.all(shortArrayPromises);
    response['shorts']=shorts
    return res.status(200).json({ movieData: response});
    // console.log(response);
  } catch (err) {
    console.log(err);
  }
};
