const { dirname } = require("path");
const Shorts = require("../models/Shorts");
const fs = require("fs");
const path = require("path");
const { time } = require("console");
const Movies = require("../models/Movies");
exports.addMovie = async (req, res) => {
  // console.log("req is coming",  req.body);
  if (!req.files.thumbnail) {
    return res.status(400).json({ msg: "please upload thumbnail" });
  }
  const { title, layouts, freeVideos, visible, genre } = req.body;
  console.log(layouts);
  // return;
  const parsedLayout = JSON.parse(layouts) .map((current) => {
    return current._id;
  });
  console.log(parsedLayout);
  // return;
  if (!title) {
    return res.status(400).json({ msg: "please provide title" });
  }
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

    const movie = await Movies.create({
      name: title,
      fileLocation: `uploads/thumbnail/${fileName}.${fileExtension}`,
      genre: genre,
      visible: visible,
      layouts: parsedLayout,
      freeVideos: freeVideos,
    });
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
      movie.shorts.push(...shortsIds);
      await movie.save();
    }
    return res.status(200).json({ msg: "file saved successfully" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ msg: "something went wrong", err: err });
  }
};
