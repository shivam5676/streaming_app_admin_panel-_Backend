const Movies = require("../models/Movies");
const Shorts = require("../models/Shorts");
const uploadVideoToTencent = require("./videoUploader");
const fs = require("fs");
exports.movieUploadByQueue = async (data) => {
  async function SaveShortsData(movieId, shortsId) {
    const response = await Movies.findByIdAndUpdate(
      movieId,
      {
        $push: {
          shorts: shortsId,
         
        },
      }
      // { new: true, upsert: true } //updated new columns
    );
  }
  try {
    console.log(data);
    const current = data.short;

    if (current.originalname === "Personalised_Ad.txt") {
      SaveShortsData(data.movieId, "Ads");

      return;
    }
    const currentShortsBuffer = fs.readFileSync(current.path);

    const videoData = await uploadVideoToTencent(currentShortsBuffer);

    const short = await Shorts.create({
      name: current.filename,
      movieName: data.title,
      fileLocation: videoData.multipleQualityUrls[0].Url,
      fileId: videoData.FileId,

      visible: true,
      genre: data.parsedGenre,
      language: data.parsedLanguage,
      low: videoData.multipleQualityUrls[1].Url,
      medium: videoData.multipleQualityUrls[2].Url,
      high: videoData.multipleQualityUrls[3].Url,
    });

    fs.unlink(current.path, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully");
      }
    });
    await SaveShortsData(data.movieId, short._id);
  } catch (error) {
    console.log(error, "error inside uploadByQueueControlllers");
  }
};
