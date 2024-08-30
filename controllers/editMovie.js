const Movies = require("../models/Movies");
const path = require("path");
const fs = require("fs");
exports.editMovie = async (req, res, next) => {
  const { id, title, layouts, freeVideos, visible, genre } = req.body;
  //   console.log(req.files.thumbnail);

  try {
    if (req.files.thumbnail) {
      const getMovies = await Movies.findById(id);
      if (!getMovies) {
        return res.status(400).json({ msg: "no data found" });
      }
      console.log(getMovies);
      const thumbnailPath = path.join(__dirname, "..", getMovies.fileLocation);
      console.log(thumbnailPath, "...");
      const deletedVideos = fs.unlinkSync(thumbnailPath);
      console.log(deletedVideos);
      const thumbnailLocation = path.join(
        __dirname,
        "..",
        "uploads",
        "thumbnail"
      );

      const pathExists = fs.existsSync(thumbnailLocation);

      if (!pathExists) {
        fs.mkdirSync(thumbnailLocation, { recursive: true });
      }
      console.log("here");
      const fileName = `${title}-thumbnail_${Date.now()}`;

      const mimeType = req.files.thumbnail[0].mimetype; // e.g., "image/png"
      const fileExtension = mimeType.split("/")[1];

      const filePath = path.join(
        thumbnailLocation,
        `${fileName}.${fileExtension}`
      );

      const uploadFile = fs.writeFileSync(
        filePath,
        req.files.thumbnail[0].buffer
      );
      console.log(uploadFile);
      try {
        const result = await getMovies.updateOne({
          name: title,
          fileLocation: `uploads/thumbnail/${fileName}.${fileExtension}`,
          genre: genre,
          visible: visible,
          layout: layouts,
          freeVideos: freeVideos,
        });
        return res.status(200).json({ updatedMovie: result });
      } catch (err) {
        console.error("Error creating document:", err);
      }
    } else {
      const getMovies = await Movies.findById(id);
      if (!getMovies) {
        return res.status(400).json({ msg: "no data found" });
      }
      try {
        const result = await getMovies.updateOne({
          name: title,
          fileLocation: getMovies.fileLocation,
          genre: genre,
          visible: visible,
          layout: layouts,
          freeVideos: freeVideos,
        });
        return res.status(200).json({ updatedMovie: result });
      } catch (err) {
        console.error("Error creating document:", err);
      }
    }
  } catch (err) {
    console.log(err);
  }
};
