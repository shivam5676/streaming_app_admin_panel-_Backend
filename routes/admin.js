const express = require("express");
const { addMovie } = require("../controllers/addMovie");

const { addSlider } = require("../controllers/addSllider");
const multer = require("multer");
const { addLayout } = require("../controllers/addLayout");
const { getAllMovies } = require("../controllers/getAllMovies");
const { deleteMovies } = require("../controllers/deleteMovies");
const upload = multer();
const routes = express.Router();
routes.post(
  "/addMovie",
  upload.fields([{ name: "thumbnail" }, { name: "shorts" }]),
  addMovie
);
routes.post("/addSlider", addSlider);
routes.post("/addLayout", addLayout);
routes.get("/allMovies", getAllMovies);
routes.delete("/deleteMovie/:id", deleteMovies);
module.exports = routes;
