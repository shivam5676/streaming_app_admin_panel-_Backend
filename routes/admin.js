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
const { addCheckedInSlide } = require("../controllers/addCheckedInSlide");
const { fetchCheckedInSlide } = require("../controllers/fetchCheckedInSlide");
const checkTaskStatus = require("../controllers/checkTaskStatus");
const { registerAdmin } = require("../controllers/auth/registerAdmin");
const { checkToken } = require("../controllers/auth/checkToken");
const { checkAdmin } = require("../controllers/auth/checkAdmin");
const { addAds } = require("../controllers/AddAds");
const { deleteAds } = require("../controllers/deleteAds");
const { disableVideo } = require("../controllers/disableVideo");
const { enableVideo } = require("../controllers/enableVideo");
const ChangeSequence = require("../controllers/ChangeSequence");
const { addAdsInMovie } = require("../controllers/AddAdsInMovie");
const { AllAds } = require("../controllers/AllAds");

const upload = multer();
const routes = express.Router();
routes.post(
  "/addMovie",
  checkToken,
  checkAdmin,
  upload.fields([
    { name: "thumbnail" },
    { name: "shorts" },
    { name: "trailerVideo" },
  ]),
  addMovie
);

routes.post(
  "/addSlider",
  checkToken,
  checkAdmin,
  upload.single("promotionalImage"),
  addSlider
);
routes.post("/addLayout", checkToken, checkAdmin, addLayout);
routes.get("/allMovies", checkToken, checkAdmin, getAllMovies);
routes.delete("/deleteMovie/:id", checkToken, checkAdmin, deleteMovies);
routes.get("/getMovie/:id", checkToken, checkAdmin, getmovie);
// routes.get("/getLayouts",checkToken,checkAdmin,getLayout)
routes.post(
  "/editMovie",
  checkToken,
  checkAdmin,
  upload.fields([{ name: "thumbnail" }, { name: "shorts" }]),
  editMovie
);
routes.get("/allLayouts", checkToken, checkAdmin, getAllLayout);
routes.get("/getLayout/:id", checkToken, checkAdmin, getLayout);
routes.post("/editLayout", checkToken, checkAdmin, editLayout);
routes.delete("/deleteShort/:id", checkToken, checkAdmin, deleteShort);
// deleteLinkedMovie
routes.post(
  "/deleteLinkedMovie",
  checkToken,
  checkAdmin,
  deleteLayoutLinkedMovies
);
routes.get("/allSliders", checkToken, checkAdmin, getAllSliders);
routes.delete("/deleteSlider/:id", checkToken, checkAdmin, deleteSlider);
routes.post(
  "/addGenre",
  checkToken,
  checkAdmin,
  upload.single("icon"),
  addGenre
);
routes.get("/allGenres", checkToken, checkAdmin, getAllGenre);
routes.delete("/deleteGenre/:id", checkToken, checkAdmin, deleteGenres);
routes.post(
  "/addLanguage",
  checkToken,
  checkAdmin,
  upload.single("icon"),
  addLanguage
);
routes.get("/allLanguages", checkToken, checkAdmin, getAllLLanguages);
routes.delete("/deleteLanguage/:id", checkToken, checkAdmin, deleteLanguage);
routes.delete("/deleteLayout/:id", checkToken, checkAdmin, deleteLayout);
routes.get("/allUsers", checkToken, checkAdmin, getAllUsers);
routes.post("/getUserDetails", checkToken, checkAdmin, getUserDetails);
routes.put("/updateUserDetails", checkToken, checkAdmin, updateUserDetails);
routes.get("/getDashboard/:type", checkToken, checkAdmin, getDashboardData);
routes.get("/getContentViews/:type", checkToken, checkAdmin, fetchContentViews);
// updateUserDetails
routes.get("/fetchTopMovies/:type", checkToken, checkAdmin, fetchTopMovies);

routes.get("/fetchLatestUsers/:type", checkToken, checkAdmin, fetchLatestUser);
routes.post("/login", adminLogin);
routes.post("/registerAdmin", checkToken, checkAdmin, registerAdmin);
routes.get("/testUpload", checkToken, checkAdmin, uploadVideoToTencent);
routes.post("/addPointSlide", checkToken, checkAdmin, addCheckedInSlide);
routes.get("/allCheckedInSlide", checkToken, checkAdmin, fetchCheckedInSlide);
routes.post("/checkTranscodeTask", checkToken, checkAdmin, checkTaskStatus);
routes.post("/addAdsInMovie", checkToken, checkAdmin, addAdsInMovie);
routes.delete("/deleteAds", checkToken, checkAdmin, deleteAds);
routes.post("/disableVideo", checkToken, checkAdmin, disableVideo);
routes.post("/enableVideo", checkToken, checkAdmin, enableVideo),
  routes.post("/changeSequence", checkToken, checkAdmin, ChangeSequence);
routes.post("/addAds", checkToken, checkAdmin, addAds);
routes.get("/getAds", checkToken, checkAdmin, AllAds);
module.exports = routes;
