const express = require("express");
const { addMovie } = require("../controllers/addMovie");

const { addSlider } = require("../controllers/addSllider");
const multer = require("multer");
const { addLayout } = require("../controllers/addLayout");
const { getAllMovies } = require("../controllers/getAllMovies");
const { deleteMovies } = require("../controllers/deleteMovies");
const { getmovie } = require("../controllers/getmovie");
const { editMovie } = require("../controllers/editMovie");
const { deleteShort } = require("../controllers/deleteShort");
const { getAllLayout } = require("../controllers/getAllLayout");
const { getLayout } = require("../controllers/getLayout");
const { editLayout } = require("../controllers/editLayout");
const {
  deleteLayoutLinkedMovies,
} = require("../controllers/deleteLayoutLinkedMovies");
const { getAllSliders } = require("../controllers/getAllSliders");
const { deleteSlider } = require("../controllers/deleteSlider");
const { addGenre } = require("../controllers/addGenre");
const { getAllGenre } = require("../controllers/getAllGenre");
const { deleteGenres } = require("../controllers/deleteGenre");
const { addLanguage } = require("../controllers/addLanguage");
const { getAllLLanguages } = require("../controllers/getAllLAnguage");
const { deleteLanguage } = require("../controllers/deleteLanguage");
const { getAllUsers } = require("../controllers/getAllUSers");

const upload = multer();
const routes = express.Router();
routes.post(
  "/addMovie",
  upload.fields([
    { name: "thumbnail" },
    { name: "shorts" },
    { name: "trailerVideo" },
  ]),
  addMovie
);
routes.post("/addSlider", upload.single("promotionalImage"), addSlider);
routes.post("/addLayout", addLayout);
routes.get("/allMovies", getAllMovies);
routes.delete("/deleteMovie/:id", deleteMovies);
routes.get("/getMovie/:id", getmovie);
// routes.get("/getLayouts",getLayout)
routes.post(
  "/editMovie",
  upload.fields([{ name: "thumbnail" }, { name: "shorts" }]),
  editMovie
);
routes.get("/allLayouts", getAllLayout);
routes.get("/getLayout/:id", getLayout);
routes.post("/editLayout", editLayout);
routes.delete("/deleteShort/:id", deleteShort);
// deleteLinkedMovie
routes.post("/deleteLinkedMovie", deleteLayoutLinkedMovies);
routes.get("/allSliders", getAllSliders);
routes.delete("/deleteSlider/:id", deleteSlider);
routes.post("/addGenre", upload.single("icon"), addGenre);
routes.get("/allGenres", getAllGenre);
routes.delete("/deleteGenre/:id", deleteGenres);
routes.post("/addLanguage", upload.single("icon"), addLanguage);
routes.get("/allLanguages", getAllLLanguages);
routes.delete("/deleteLanguage/:id", deleteLanguage);
routes.get("/allUsers", getAllUsers);
module.exports = routes;
