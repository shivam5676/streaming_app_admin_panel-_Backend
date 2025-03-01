const { dirname } = require("path");
const Shorts = require("../models/Shorts");
const fs = require("fs");
const path = require("path");
const { time } = require("console");
const Movies = require("../models/Movies");
const Layout = require("../models/Layout");
const uploadVideoToTencent = require("./videoUploader");
const {
  addTaskToMovieUploadQueue,
} = require("../queue/TaskQueue/Movies/addTAskToMovieUploadQueue");
exports.addMovie = async (req, res) => {
  const { title, layouts, freeVideos, visible, genre, trailerUrl, language } =
    req.body;
  if (!req?.files?.thumbnail) {
    return res.status(400).json({ msg: "please upload thumbnail" });
  }

  if (!title) {
    return res.status(400).json({ msg: "please provide title" });
  }
  if (layouts.length == 0 || !JSON.parse(layouts)) {
    return res.status(400).json({ msg: "please select layout" });
  }
  if (genre.length == 0 || !JSON.parse(genre)) {
    return res.status(400).json({ msg: "please provide genre" });
  }
  if (language.length == 0 || !JSON.parse(language)) {
    return res.status(400).json({ msg: "please provide content language" });
  }
  if (!req?.files?.trailerVideo && !req.body.trailerUrl) {
    return res
      .status(400)
      .json({ msg: "please provide trailerUrl or trailer video" });
  }

  const thumbNailName = req?.files?.thumbnail[0]?.filename;
  const parsedLayout = JSON.parse(layouts).map((current) => {
    return current._id;
  });
  const parsedGenre = JSON.parse(genre).map((current) => {
    return current._id;
  });
  const parsedLanguage = JSON.parse(language).map((current) => {
    return current._id;
  });

  try {
    let trailerUrlTencent = undefined;
    if (req.files?.trailerVideo && req.files.trailerVideo.length > 0) {
      let trailerPath = req?.files?.trailerVideo[0]?.path || "";
      let trailerBuffer = fs.readFileSync(trailerPath) || "";

      trailerUrlTencent = await uploadVideoToTencent(trailerBuffer);
      fs.unlink(trailerPath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully");
        }
      });
    }
    //we neee to handle if admin uses direct upload link then it will convert the file and save it to tencent so that we could maintaing same sttings like video

    const movie = await Movies.create({
      name: title,
      fileLocation: `uploads/thumbnail/${thumbNailName}`,
      genre: parsedGenre,
      language: parsedLanguage,
      visible: visible,
      layouts: parsedLayout,
      freeVideos: freeVideos,
      trailerUrl: trailerUrl || trailerUrlTencent?.multipleQualityUrls[0]?.Url,
      trailerUrlFileId: trailerUrlTencent?.FileId,
      parts: req.files?.shorts?.length || 0,
      low: trailerUrlTencent?.multipleQualityUrls[1]?.Url,
      medium: trailerUrlTencent?.multipleQualityUrls[2]?.Url,
      high: trailerUrlTencent?.multipleQualityUrls[3]?.Url,
    });
    if (movie) {
      const pendingPromises = parsedLayout.map(async (current) => {
        const layoutResponse = await Layout.findById(current);
        if (layoutResponse) {
          layoutResponse.linkedMovies.push(movie._id);
          await layoutResponse.save();
        }
      });
      await Promise.all(pendingPromises);
    }
    // console.log(movie);
    const shortsFolderLocation = path.join(
      __dirname,
      "..",
      "uploads",
      "shorts"
    );
    const shortsFolderExists = fs.existsSync(shortsFolderLocation);
    if (!shortsFolderExists) {
      fs.mkdirSync(shortsFolderLocation);
    }
    if (req?.files?.shorts?.length > 0) {
      req.files.shorts.forEach((short) => {
        addTaskToMovieUploadQueue({
          short, // Pass one short at a time
          parsedLanguage,
          parsedGenre,
          title,
          movieId: movie._id, // Pass only ID to avoid serialization issues
        });
      });
    }
    // addTaskToMovieUploadQueue({
    //   shorts: req.files.shorts,
    //   parsedLanguage,
    //   parsedGenre,
    //   title,
    //   movie
    // });

    // if (req.files.shorts && req.files.shorts.length > 0) {
    //   const shortsPromises = req.files.shorts.map(async (current) => {
    //     if (current.originalname === "Personalised_Ad.txt") {
    //       return "Ads";
    //     }
    //     const currentShortsBuffer = fs.readFileSync(current.path);

    //     const videoData = await uploadVideoToTencent(currentShortsBuffer);

    //     const short = await Shorts.create({
    //       name: current.filename,
    //       movieName: title,
    //       fileLocation: videoData.multipleQualityUrls[0].Url,
    //       fileId: videoData.FileId,
    //       // genre: "action",
    //       visible: true,
    //       genre: parsedGenre,
    //       language: parsedLanguage,
    //       low: videoData.multipleQualityUrls[1].Url,
    //       medium: videoData.multipleQualityUrls[2].Url,
    //       high: videoData.multipleQualityUrls[3].Url,
    //     });

    //     fs.unlink(current.path, (err) => {
    //       if (err) {
    //         console.error("Error deleting file:", err);
    //       } else {
    //         console.log("File deleted successfully");
    //       }
    //     });

    //     return short._id;
    //   });
    //   const shortsIds = await Promise.all(shortsPromises);
    //   movie.shorts.push(...shortsIds);
    //   await movie.save();
    // }

    return res
      .status(200)
      .json({ msg: "file saved successfully", movieData: movie });
  } catch (err) {
    console.log(err);
    const newThumbnailPAth = req?.files?.thumbnail[0].path;
    fs.unlink(newThumbnailPAth, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully");
      }
    });
    return res.status(400).json({ msg: "something went wrong", err: err });
  }
};
