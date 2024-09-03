const Movies = require("../models/Movies");
const path = require("path");
const fs = require("fs");
const Shorts = require("../models/Shorts");
exports.editMovie = async (req, res, next) => {
  const { id, title, layouts, freeVideos, visible, genre } = req.body;
  console.log(req.files.shorts);
  const parsedLayout = JSON.parse(layouts).map((current) => {
    return current._id;
  });
  try {
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

      try {
        const result = await getMovies.updateOne({
          name: title,
          fileLocation: `uploads/thumbnail/${fileName}.${fileExtension}`,
          genre: genre,
          visible: visible,
          layouts: parsedLayout,
          freeVideos: freeVideos,
        });
        if (req.files.shorts && req.files.shorts.length > 0) {
          const shortsPromises = req.files.shorts.map(async (current) => {
            const shortsName = `${
              current.originalname.split(".")[0]
            }_${Date.now()}.${current.mimetype.split("/")[1]}`;
            const shortsPath = path.join(shortsFolderLocation, shortsName);
            const uploadShorts = fs.writeFileSync(shortsPath, current.buffer);
            const short = await Shorts.create({
              name: current.originalname,
              fileLocation: `uploads/shorts/${shortsName}`,
              genre: "action",
              visible: true,
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
          layouts: parsedLayout,
          freeVideos: freeVideos,
        });
        if (req.files.shorts && req.files.shorts.length > 0) {
          const shortsPromises = req.files.shorts.map(async (current) => {
            const shortsName = `${
              current.originalname.split(".")[0]
            }_${Date.now()}.${current.mimetype.split("/")[1]}`;
            const shortsPath = path.join(shortsFolderLocation, shortsName);
            const uploadShorts = fs.writeFileSync(shortsPath, current.buffer);
            const short = await Shorts.create({
              name: current.originalname,
              fileLocation: `uploads/shorts/${shortsName}`,
              genre: "action",
              visible: true,
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
    // if (req.files.shorts && req.files.shorts.length > 0) {
    //   const shortsPromises = req.files.shorts.map(async (current) => {
    //     const shortsName = `${
    //       current.originalname.split(".")[0]
    //     }_${Date.now()}.${current.mimetype.split("/")[1]}`;
    //     const shortsPath = path.join(shortsFolderLocation, shortsName);
    //     const uploadShorts = fs.writeFileSync(shortsPath, current.buffer);
    //     const short = await Shorts.create({
    //       name: current.originalname,
    //       fileLocation: `uploads/shorts/${shortsName}`,
    //       genre: "action",
    //       visible: true,
    //     });
    //     return short._id;
    //   });

    //   const shortsIds = await Promise.all(shortsPromises);
    //   getMovies.shorts.push(...shortsIds);
    //   const movieResponse = await getMovies.save();
    //   console.log(movieResponse)
    // }
  } catch (err) {
    console.log(err);
  }
};
