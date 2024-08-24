const express = require("express");
const { addMovie } = require("../controllers/addMovie");
const multer = require("multer");
const upload = multer();
const routes = express.Router();
routes.post(
  "/addMovie",
  upload.fields([{ name: "thumbnail" }, { name: "shorts" }]),
  addMovie
);

module.exports = routes;
