const { status } = require("express/lib/response");
const Movies = require("../models/Movies");
const Shorts = require("../models/Shorts");
const deleteVideoFromTencent = require("./deleteVideoFromTencent");

exports.deleteMovies = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  try {
    const deleteResponse = await Movies.findByIdAndDelete(id);
    if (!deleteResponse) {
      return res
        .status(400)
        .json({ msg: "umable to find movie ", status: false });
    }
    console.log(deleteResponse, "dlresponse");
    //i need to add delte all related shorts from tencent cloud
    const deleteShortsPromises = await deleteResponse.shorts.map(
      async (current) => {
        const short = await Shorts.findById(current);

        if (short) {
          // Delete the video from Tencent Cloud (use your API method)
          console.log(short,"fileId")
          if(short.fileId){
            await deleteVideoFromTencent(short.fileId); // Assuming `fileId` is stored in the Shorts model
          }
          

          // Delete the short from the database
          await Shorts.findByIdAndDelete(current);
        }
      }
    );
    await Promise.all(deleteShortsPromises);

    return res.status(200).json({ msg: "deleted Successfully" });
  } catch (err) {
    return res.status(400).json({ msg: err });
    ``;
  }
};
