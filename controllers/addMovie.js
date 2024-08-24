const { dirname } = require("path");
const Shorts = require("../models/Shorts");
const fs = require("fs");
const path = require("path");
const { time } = require("console");
exports.addMovie = async (req, res) => {
  // console.log("req is coming",  req.body);
  const { title, layouts, freeVideos, visible } = req.body;

  const thumbnailPath = path.join(__dirname, "..", "uploads", "thumbnail");

  const pathExists = fs.existsSync(thumbnailPath);
 
  if (!pathExists) {
    fs.mkdirSync(thumbnailPath, { recursive: true });
  }
  const fileName = `${title}-thumbnail_${Date.now()}`;
  
  const mimeType = req.files.thumbnail[0].mimetype; // e.g., "image/png"
  const fileExtension = mimeType.split("/")[1];
 
  const filePath = path.join(thumbnailPath, `${fileName}.${fileExtension}`);

  const uploadFile = fs.writeFileSync(filePath, req.files.thumbnail[0].buffer);
  // console.log(req.files.shorts)
  // console.log("object",req.files)
  // return;
  // try {
  //   const result = await Shorts.create({
  //
  //     name: "hola",
  //     genre: "pola",
  //     fileLocation: "gola",
  //     visible: true,
  //   });
  //   console.log(result);
  // } catch (err) {
  //   console.error("Error creating document:", err);
  // }
};
