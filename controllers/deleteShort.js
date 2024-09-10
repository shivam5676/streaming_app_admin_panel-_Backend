const Shorts = require("../models/Shorts");
const fs = require("fs");
const path = require("path");
exports.deleteShort = async (req, res, next) => {
  console.log(req.params.id);
  const { id } = req.params;
  try {
    const response = await Shorts.findByIdAndDelete(id);
    console.log(response);
    if (!response) {
      return res
        .status(400)
        .json({ msg: "could  not find the file plz try after sometime" });
    }
    const deleteResponse = fs.unlinkSync(
      path.join(__dirname, "..", response.fileLocation)
    );
    return res
      .status(200)
      .json({
        deletedResponse: deleteResponse,
        msg: "file deleted successfully",
      });
  } catch (err) {
    console.log(err);
  }
};
