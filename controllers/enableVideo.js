const Shorts = require("../models/Shorts");

exports.enableVideo = async (req, res) => {
  console.log(req.body);
  if (req.body.length == 0) {
    return res.status(400).json({ msg: "no id selected" });
  }
  try {
    const response = await Shorts.updateMany(
      { _id: { $in: req.body } }, // Find documents where _id is in the array
      { $set: { visible: true } }, // Update the 'status' field
      { multi: true }
    );
    
    return res.status(200).json({ msg: "modified successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "something went wrong", error });
  }
};
