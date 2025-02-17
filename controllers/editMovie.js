const Movies = require("../models/Movies");
const path = require("path");
const fs = require("fs");
const Shorts = require("../models/Shorts");
const Layout = require("../models/Layout");
const Genre = require("../models/genre");
const uploadVideoToTencent = require("./videoUploader");
exports.editMovie = async (req, res, next) => {
  const { id, title, layouts, freeVideos, visible, genre, language } = req.body;

  const parsedLanguage = JSON.parse(language).map((current) => {
    return current._id;
  });

  async function unlinkMovieHandler() {
    const allLayouts = await Movies.findById(id).select("layouts -_id");

    const pendingPromises = allLayouts?.layouts.map(async (current) => {
      const matched = JSON.parse(layouts)?.find((element) => {
        return element._id == current.toString();
      });

      if (!matched) {
        console.log(current, "...>");
        const delinkMoviesFromLAyout = await Layout.findById(current);
        await delinkMoviesFromLAyout.linkedMovies.pull(id);
        await delinkMoviesFromLAyout.save();
      }
    });
    await Promise.all(pendingPromises);
  }

  const parsedLayout = JSON.parse(layouts).map((current) => {
    return current._id;
  }); //i need to check if any id is already present then dont return it in parsed layout because it will come twice
  const parsedGenre = JSON.parse(genre).map((current) => {
    return current._id;
  });

  try {
    const shortsFolderLocation = path.join(
      __dirname,
      "..",
      "uploads",
      "shorts"
    );

    if (req.files.thumbnail) {
      const getMovies = await Movies.findById(id);
      if (!getMovies) {
        return res.status(400).json({ msg: "no data found" });
      }
      console.log(getMovies.fileLocation);
      const thumbnailPath = path.join(__dirname, "..", getMovies.fileLocation);

      const thumbNailName = req?.files?.thumbnail[0]?.filename;
      try {
        unlinkMovieHandler();
        const result = await getMovies.updateOne({
          name: title,
          fileLocation: `uploads/thumbnail/${thumbNailName}`,
          genre: parsedGenre,
          visible: visible,
          layouts: parsedLayout,
          freeVideos: freeVideos,
          language: parsedLanguage,
        });
        if (parsedLayout.length > 0) {
          const pendingPromises = parsedLayout.map(async (current) => {
            const layoutResponse = await Layout.findOne({
              _id: current,
              linkedMovies: { $ne: id },
            });
            if (layoutResponse) {
              layoutResponse.linkedMovies.push(id);
              await layoutResponse.save();
            }
          });
          await Promise.all(pendingPromises);
        }
        if (parsedGenre.length > 0) {
          const pendingPromises = parsedGenre.map(async (current) => {
            const genreResponse = await Genre.findOne({
              _id: current,
              linkedMovies: { $ne: id },
            });
            if (genreResponse) {
              genreResponse.linkedMovies.push(id);
              await genreResponse.save();
            }
          });
          await Promise.all(pendingPromises);
        }
        // const response = await Layout.find().select("_id");
        // console.log(response)
        if (req.files.shorts && req.files.shorts.length > 0) {
          const shortsPromises = req.files.shorts.map(async (current) => {
            const currentShortsBuffer = fs.readFileSync(current.path);
            // const uploadShorts = fs.writeFileSync(shortsPath, current.buffer);
            const videoData = await uploadVideoToTencent(currentShortsBuffer);
            const short = await Shorts.create({
              name: current.filename,
              // fileLocation: `uploads/shorts/${shortsName}`,
              fileLocation: videoData.multipleQualityUrls[0].Url,

              visible: true,
              genre: parsedGenre,
              // language: parsedLanguage,
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
            return short._id;
          });

          const shortsIds = await Promise.all(shortsPromises);
          getMovies.shorts.push(...shortsIds);
          const movieResponse = await getMovies.save();
          console.log(movieResponse);
        }
        fs.unlink(thumbnailPath, (err) => {
          if (err) {
            console.log(err);
          }
          console.log("previous thumbnail deleted");
        });

        return res.status(200).json({ updatedMovie: result });
      } catch (err) {
        const newThumbnailPAth = req?.files?.thumbnail[0].path;
        fs.unlink(newThumbnailPAth, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          } else {
            console.log("File deleted successfully");
          }
        });
        console.error("Error creating document:", err);
      }
    } else {
      const getMovies = await Movies.findById(id);
      if (!getMovies) {
        return res.status(400).json({ msg: "no data found" });
      }
      unlinkMovieHandler();
      try {
        const result = await getMovies.updateOne({
          name: title,
          fileLocation: getMovies.fileLocation,
          genre: parsedGenre,
          visible: visible,
          layouts: parsedLayout,
          freeVideos: freeVideos,
          language: parsedLanguage,
        });
        if (parsedLayout.length > 0) {
          const pendingPromises = parsedLayout.map(async (current) => {
            const layoutResponse = await Layout.findOne({
              _id: current,
              linkedMovies: { $ne: id },
            });
            if (layoutResponse) {
              layoutResponse.linkedMovies.push(id);
              await layoutResponse.save();
            }
          });

          await Promise.all(pendingPromises);
        }
        if (parsedGenre.length > 0) {
          const pendingPromises = parsedGenre.map(async (current) => {
            const genreResponse = await Genre.findOne({
              _id: current,
              linkedMovies: { $ne: id },
            });
            if (genreResponse) {
              genreResponse.linkedMovies.push(id);
              await genreResponse.save();
            }
          });
          await Promise.all(pendingPromises);
        }
        if (req.files.shorts && req.files.shorts.length > 0) {
          const shortsPromises = req.files.shorts.map(async (current) => {
            const currentShortsBuffer = fs.readFileSync(current.path);
            // const uploadShorts = fs.writeFileSync(shortsPath, current.buffer);
            const videoData = await uploadVideoToTencent(currentShortsBuffer);

            const short = await Shorts.create({
              name: current.filename,

              fileLocation: videoData.MediaUrl,
              fileId: videoData.FileId,

              visible: true,
              genre: parsedGenre,
              // language: parsedLanguage,
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
            return short._id;
          });

          const shortsIds = await Promise.all(shortsPromises);
          getMovies.shorts.push(...shortsIds);
          const movieResponse = await getMovies.save();

          console.log(movieResponse);
        }

        return res.status(200).json({ updatedMovie: result });
      } catch (err) {
        console.error("Error creating document:", err);
      }
    }
  } catch (err) {
    console.log(err);
    return res
    .status(500)
    .json({ msg: "something went wrong",err:error });
  }
};
