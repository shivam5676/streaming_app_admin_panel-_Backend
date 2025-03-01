const Movies = require("../models/Movies");
const Shorts = require("../models/Shorts");
const uploadVideoToTencent = require("./videoUploader");
const fs = require("fs");
exports.movieUploadByQueue = async (data, queueJobID) => {
  try {
    const response = await Movies.findByIdAndUpdate(
      data.movieId,
      {
        $set: { shortsJobs: { $ifNull: ["$shortsJobs", []] } },
        $push: {
          shorts: "newShort._id ",
          shortsJobs: {
            $each: [{ queueJobID: "queueJobID", shortsId: "newShort._id" }], // Ensures correct object push
          },
        },
      },
      { new: true, upsert: true } //updated new columns
    );

    console.log(response);
    // const shortsPromises = data.shorts.map(async (current) => {
    //   if (current.originalname === "Personalised_Ad.txt") {
    //     return "Ads";
    //   }
    //   const currentShortsBuffer = fs.readFileSync(current.path);

    //   const videoData = await uploadVideoToTencent(currentShortsBuffer);

    //   const short = await Shorts.create({
    //     name: current.filename,
    //     movieName: data.title,
    //     fileLocation: videoData.multipleQualityUrls[0].Url,
    //     fileId: videoData.FileId,

    //     visible: true,
    //     genre: data.parsedGenre,
    //     language: data.parsedLanguage,
    //     low: videoData.multipleQualityUrls[1].Url,
    //     medium: videoData.multipleQualityUrls[2].Url,
    //     high: videoData.multipleQualityUrls[3].Url,
    //   });

    //   fs.unlink(current.path, (err) => {
    //     if (err) {
    //       console.error("Error deleting file:", err);
    //     } else {
    //       console.log("File deleted successfully");
    //     }
    //   });

    //   return short._id;
    // });
    // const shortsIds = await Promise.all(shortsPromises);
    // data.movie.shorts.push(...shortsIds);
    // await data.movie.save();
  } catch (error) {
    console.log(error, "error inside uploadByQueueControlllers");
  }
};
