const Movies = require("../models/Movies");

exports.deleteAds = async (req, res) => {
  const { index, movieId } = req.body;
  if (index === undefined || index === null) {
    return res.status(400).json({
      msg: "invalid ads id selected ...plz refresh thge page and contact the supprt team if problem is coming",
    });
  }
  if (!movieId) {
    return res.status(400).json({
      msg: "invalid movies id selected ...plz refresh thge page and contact the supprt team if problem is coming",
    });
  }

  try {
    const response = await Movies.findById({ _id: movieId });
    // Movies.shor
    // console.log(response.shorts[index]);
    if (response.shorts[index] != "Ads") {
      return res.status(400).json({
        msg: "invalid ads id... refresh the page and de;lete it again",
      });
    }
    const data = response.shorts.filter((current, idx) => idx != index);
    response.shorts = data;
    response.save();

    return res.status(200).json({
      msg: "Ads Removed Successfully",
    });
  } catch (error) {}
};
