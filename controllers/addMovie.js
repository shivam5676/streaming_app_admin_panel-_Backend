const { dirname } = require("path");
const Shorts = require("../models/Shorts");
const fs = require("fs");
const path = require("path");
const { time } = require("console");
const Movies = require("../models/Movies");
const Layout = require("../models/Layout");
const uploadVideoToTencent = require("./videoUploader");
exports.addMovie = async (req, res) => {
  if (!req.files.thumbnail) {
    return res.status(400).json({ msg: "please upload thumbnail" });
  }
  const { title, layouts, freeVideos, visible, genre, trailerUrl, language } =
    req.body;

  // console.log(JSON.parse(language));
  // return;
  if (!title) {
    return res.status(400).json({ msg: "please provide title" });
  }
  if (!layouts || !JSON.parse(layouts)) {
    return res.status(400).json({ msg: "please select layout" });
  }
  if (!genre || !JSON.parse(genre)) {
    return res.status(400).json({ msg: "please provide genre" });
  }
  if (!req.files?.trailerVideo && !req.files.trailerVideo) {
    return res
      .status(400)
      .json({ msg: "please provide trailerUrl or trailer video" });
  }
  if (!language || !JSON.parse(language)) {
    return res.status(400).json({ msg: "please provide content language" });
  }

  const parsedLayout = JSON.parse(layouts).map((current) => {
    return current._id;
  });
  const parsedGenre = JSON.parse(genre).map((current) => {
    return current._id;
  });
  const parsedLanguage = JSON.parse(language).map((current) => {
    return current._id;
  });

  const thumbnailPath = path.join(__dirname, "..", "uploads", "thumbnail");

  const pathExists = fs.existsSync(thumbnailPath);

  if (!pathExists) {
    fs.mkdirSync(thumbnailPath, { recursive: true });
  }
  try {
    const fileName = `${title}-thumbnail_${Date.now()}`;

    const mimeType = req.files.thumbnail[0].mimetype; // e.g., "image/png"
    const fileExtension = mimeType.split("/")[1];

    const filePath = path.join(thumbnailPath, `${fileName}.${fileExtension}`);

    const uploadFile = fs.writeFileSync(
      filePath,
      req.files.thumbnail[0].buffer
    );
    let trailerUrlTencent = undefined;
    if (req.files?.trailerVideo && req.files.trailerVideo.length > 0) {
      trailerUrlTencent = await uploadVideoToTencent(
        req.files.trailerVideo[0].buffer
      );
    }
    const movie = await Movies.create({
      name: title,
      fileLocation: `uploads/thumbnail/${fileName}.${fileExtension}`,
      genre: parsedGenre,
      language: parsedLanguage,
      visible: visible,
      layouts: parsedLayout,
      freeVideos: freeVideos,
      trailerUrl: trailerUrl || trailerUrlTencent.multipleQualityUrls[0].Url,
      trailerUrlFileId: trailerUrlTencent?.FileId,
      parts: req.files?.shorts?.length || 0,
      low: trailerUrlTencent.multipleQualityUrls[1].Url,
      medium: trailerUrlTencent.multipleQualityUrls[2].Url,
      high: trailerUrlTencent.multipleQualityUrls[3].Url,
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
    if (req.files.shorts && req.files.shorts.length > 0) {
      const shortsPromises = req.files.shorts.map(async (current) => {
        if (current.originalname === "Personalised_Ad.txt") {
          return "Ads";
        }
        const shortsName = `${
          current.originalname.split(".")[0]
        }_${Date.now()}.${current.mimetype.split("/")[1]}`;
        const shortsPath = path.join(shortsFolderLocation, shortsName);
        const uploadShorts = fs.writeFileSync(shortsPath, current.buffer);
        const videoData = await uploadVideoToTencent(current.buffer);
        console.log(videoData, "videoData");
        // return
        const short = await Shorts.create({
          name: current.originalname,

          fileLocation: videoData.multipleQualityUrls[0].Url,
          fileId: videoData.FileId,
          genre: "action",
          visible: true,
          genre: parsedGenre,
          language: parsedLanguage,
          low: videoData.multipleQualityUrls[1].Url,
          medium: videoData.multipleQualityUrls[2].Url,
          high: videoData.multipleQualityUrls[3].Url,
        });
        console.log(short, "short_promises");
        return short._id;
      });
      const shortsIds = await Promise.all(shortsPromises);
      movie.shorts.push(...shortsIds);
      await movie.save();
    }

    return res
      .status(200)
      .json({ msg: "file saved successfully", movieData: movie });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ msg: "something went wrong", err: err });
  }
};
