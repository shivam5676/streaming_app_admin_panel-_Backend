const checkInpoints = require("../models/checkInPoints");

exports.fetchCheckedInSlide = async (req, res) => {
  try {
    const response = await checkInpoints.find();
    return res.status(200).json({ checkedInData: response });
  } catch (error) {
    console.log(error)
  }
};
