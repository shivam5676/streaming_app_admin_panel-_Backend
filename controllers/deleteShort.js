const Shorts = require("../models/Shorts");
const fs = require("fs");
const path = require("path");
const deleteVideoFromTencent = require("./deleteVideoFromTencent")
exports.deleteShort = async (req, res, next) => {
  console.log(req.params.id);
  const { id } = req.params;
  try {
    const response = await Shorts.findByIdAndDelete(id);

    // if (!response) {
    //   return res
    //     .status(400)
    //     .json({ msg: "could  not find the file plz try after sometime" });
    // }
    // const deleteResponse = fs.unlinkSync(
    //   path.join(__dirname, "..", response.fileLocation)
    // );
    const deleteResponse = await deleteVideoFromTencent(response.fileId)
    console.log(deleteResponse)
    if (!deleteResponse.status) {



      //rollback the mongo db deleted file
      return res.status(400).json({ msg: deleteResponse.msg, err: deleteResponse.err })
    }
    return res
      .status(200)
      .json({
        deletedResponse: deleteResponse,

      });
  } catch (err) {
    console.log(err);
    return res
    .status(500)
    .json({ msg: "something went wrong",err:err });
  }
};
