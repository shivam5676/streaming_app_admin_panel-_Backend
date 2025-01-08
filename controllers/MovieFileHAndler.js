const fs = require("fs");
const path = require("path");
exports.movieFileHandler = (req, res, next) => {
  if (!req.files) {
    return next(); // No files, skip
  }

  req.uploadedFiles = {};

  // Ensure upload directory exists
  const uploadDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Process the files saved by Multer to disk
  const saveFile = (file, folderName) => {
    const uploadPath = path.join(__dirname, "..", "uploads", folderName);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Return the path of the saved file
    const filePath = path.join(uploadPath, file.filename);
    return `uploads/${folderName}/${file.filename}`;
  };

  // Map files to the uploadedFiles object
  if (req.files.thumbnail) {
    req.uploadedFiles.thumbnail = saveFile(req.files.thumbnail[0], "thumbnail");
  }
  if (req.files.trailerVideo) {
    req.uploadedFiles.trailerVideo = saveFile(
      req.files.trailerVideo[0],
      "trailers"
    );
  }
  if (req.files.shorts) {
    req.uploadedFiles.shorts = req.files.shorts.map((short) =>
      saveFile(short, "shorts")
    );
  }

  next(); // Proceed to the next middleware/controller
};
