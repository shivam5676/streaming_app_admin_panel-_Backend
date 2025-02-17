const path = require("path");
const fs = require("fs");
const Genre = require("../models/genre");
exports.addGenre = async (req, res, next) => {
  const file = req.file;
  const name = req.body.name;

  const genreImagePath = path.join(__dirname, "..", "uploads", "genreImage");

  const pathExists = fs.existsSync(genreImagePath);
  if (!pathExists) {
    fs.mkdirSync(genreImagePath, { recursive: true });
  }

  try {
    const fileName = `${name}_${file.originalname}`;
    const filePath = path.join(genreImagePath, fileName);

    const uploadFile = fs.writeFileSync(filePath, file.buffer);
    const saveGenre = await Genre.create({
      name: name,
      icon: `uploads/genreImage/${fileName}`,
    });
    if (!saveGenre) {
      return res
        .status(400)
        .json({ msg: "err while saving the genre.plz try again..." });
    }
    return res.status(200).json({ genre: saveGenre });
  } catch (error) {
    return res
        .status(500)
        .json({ msg: "something went wrong",err:error });
  }
};
