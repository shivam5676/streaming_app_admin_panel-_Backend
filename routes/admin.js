const express = require("express");
const { addMovie } = require("../controllers/addMovie");

const { addSlider } = require("../controllers/addSllider");
const multer = require("multer");
const { addLayout } = require("../controllers/addLayout");
const upload = multer();
const routes = express.Router();
routes.post(
  "/addMovie",
  upload.fields([{ name: "thumbnail" }, { name: "shorts" }]),
  addMovie
);
routes.post("/addSlider", addSlider);
routes.post("/addLayout",addLayout)
module.exports = routes;
