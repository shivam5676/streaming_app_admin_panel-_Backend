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
const { getUserDetails } = require("../controllers/getUserDetails");
const { deleteLayout } = require("../controllers/deleteLAyout");
const { updateUserDetails } = require("../controllers/updateUserDetails");
const { getDashboardData } = require("../controllers/getDAshBoardData");
const { fetchContentViews } = require("../controllers/fetchContentViews");
const { fetchTopMovies } = require("../controllers/fetchTopMovies");
const { fetchLatestUser } = require("../controllers/fetchLatestUSer");
const { adminLogin } = require("../controllers/auth/adminLogin");
const uploadVideoToTencent = require("../controllers/videoUploader");
const {  addCheckedInSlide } = require("../controllers/addCheckedInSlide");
const { fetchCheckedInSlide } = require("../controllers/fetchCheckedInSlide");
const checkTaskStatus = require("../controllers/checkTaskStatus");
const { registerAdmin } = require("../controllers/auth/registerAdmin");


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
routes.delete("/deleteLayout/:id", deleteLayout);
routes.get("/allUsers", getAllUsers);
routes.post("/getUserDetails", getUserDetails);
routes.put("/updateUserDetails", updateUserDetails);
routes.get("/getDashboard/:type", getDashboardData);
routes.get("/getContentViews/:type", fetchContentViews);
// updateUserDetails
routes.get("/fetchTopMovies/:type", fetchTopMovies);
routes.get("/fetchLatestUsers/:type", fetchLatestUser);
routes.post("/login", adminLogin);
routes.post("/registerAdmin",registerAdmin)
routes.get("/testUpload",uploadVideoToTencent)
routes.post("/addPointSlide",addCheckedInSlide)
routes.get("/allCheckedInSlide",fetchCheckedInSlide)
routes.post("/checkTranscodeTask",checkTaskStatus)
module.exports = routes;
