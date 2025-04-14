const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { addMovie } = require("../controllers/movies/addMovie");
const { getAllMovies } = require("../controllers/movies/getAllMovies");
const { deleteMovies } = require("../controllers/movies/deleteMovies");
const { getmovie } = require("../controllers/movies/getmovie");
const { editMovie } = require("../controllers/movies/editMovie");
const ChangeSequence = require("../controllers/movies/ChangeSequence");
const { disableVideo } = require("../controllers/movies/disableVideo");
const { enableVideo } = require("../controllers/movies/enableVideo");
const { addAdsInMovie } = require("../controllers/movies/AddAdsInMovie");

const { addSlider } = require("../controllers/sliders/addSllider");
const { getAllSliders } = require("../controllers/sliders/getAllSliders");
const { deleteSlider } = require("../controllers/sliders/deleteSlider");

const { addLayout } = require("../controllers/layouts/addLayout");
const { deleteLayout } = require("../controllers/layouts/deleteLAyout");
const { getAllLayout } = require("../controllers/layouts/getAllLayout");
const { getLayoutData } = require("../controllers/layouts/getLayoutData");
const { editLayout } = require("../controllers/layouts/editLayout");
const {
  deleteLayoutLinkedMovies,
} = require("../controllers/deleteLayoutLinkedMovies");
const { deleteShort } = require("../controllers/deleteShort");

const { addGenre } = require("../controllers/genres/addGenre");
const { getAllGenre } = require("../controllers/genres/getAllGenre");
const { deleteGenres } = require("../controllers/genres/deleteGenre");

const { addLanguage } = require("../controllers/language/addLanguage");
const { getAllLLanguages } = require("../controllers/language/getAllLAnguage");
const { deleteLanguage } = require("../controllers/language/deleteLanguage");

const { getAllUsers } = require("../controllers/users/getAllUSers");
const { getUserDetails } = require("../controllers/users/getUserDetails");
const { updateUserDetails } = require("../controllers/users/updateUserDetails");

const {
  getDashboardData,
} = require("../controllers/dashboard/getDAshBoardData");
const {
  fetchContentViews,
} = require("../controllers/dashboard/fetchContentViews");
const { fetchTopMovies } = require("../controllers/dashboard/fetchTopMovies");
const { fetchLatestUser } = require("../controllers/dashboard/fetchLatestUSer");

const { adminLogin } = require("../controllers/auth/adminLogin");
const uploadVideoToTencent = require("../controllers/videoUploader");

const checkTaskStatus = require("../controllers/checkTaskStatus");
const { registerAdmin } = require("../controllers/auth/registerAdmin");
const { checkToken } = require("../controllers/auth/checkToken");
const { checkAdmin } = require("../controllers/auth/checkAdmin");

const { addAds } = require("../controllers/advertisements/AddAds");
const { deleteAds } = require("../controllers/advertisements/deleteAds");
const { AllAds } = require("../controllers/advertisements/AllAds");

const {
  addCheckedInSlide,
} = require("../controllers/checkinTask/addCheckedInSlide");
const {
  fetchCheckedInSlide,
} = require("../controllers/checkinTask/fetchCheckedInSlide");

const {
  sendNotification,
} = require("../controllers/notification/sendNotification");
const {
  saveNotification,
} = require("../controllers/notification/saveNotification");
const { movieFileHandler } = require("../controllers/MovieFileHAndler");

const {
  getAllNotification,
} = require("../controllers/notification/getAllNotificationTask");
const { terminateJob } = require("../controllers/TerminateJob");
const { AddMintsPlan } = require("../controllers/mintsPlan/AddMintsPlan");
const { setShortsDeductionPoints } = require("../controllers/movies/setShortsDeductionPoints");
const { AllAdmin } = require("../controllers/Admin/AllAdmin");
const { AllMintsPlan } = require("../controllers/mintsPlan/AllMintsPlan");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define base upload directory
    const baseUploadDir = path.join(__dirname, "..", "uploads");
    let uploadDir;

    // Customize subdirectories based on fieldname
    switch (file.fieldname) {
      case "thumbnail":
        uploadDir = path.join(baseUploadDir, "thumbnail");
        break;
      case "shorts":
        uploadDir = path.join(baseUploadDir, "shorts");
        break;
      case "trailerVideo":
        uploadDir = path.join(baseUploadDir, "trailerVideo");
        break;
      default:
        uploadDir = baseUploadDir; // Fallback to base directory
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir); // Set upload directory
  },

  filename: (req, file, cb) => {
    // Define unique file name

    const fileExtension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const uniqueFileName =
      file.originalname.split(".").slice(0, -1).join(".") +
      "-" +
      uniqueSuffix +
      fileExtension;
    cb(null, uniqueFileName);
    file.modifiedName = uniqueFileName;
  },
});

// Use disk storage and accept multiple file types for specific fields
const uploadMovieData = multer({ storage: storage });
const upload = multer();
const routes = express.Router();
routes.post(
  "/addMovie",
  checkToken,
  checkAdmin,
  uploadMovieData.fields([
    { name: "thumbnail" },
    { name: "shorts" },
    { name: "trailerVideo" },
  ]),
  // movieFileHandler,
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
  uploadMovieData.fields([{ name: "thumbnail" }, { name: "shorts" }]),
  editMovie
);
routes.get("/allLayouts", checkToken, checkAdmin, getAllLayout);
routes.get("/getLayout/:id", checkToken, checkAdmin, getLayoutData);
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
routes.post("/setShortspoints",checkToken,checkAdmin, setShortsDeductionPoints)
  routes.post("/changeSequence", checkToken, checkAdmin, ChangeSequence);
routes.post("/addAds", checkToken, checkAdmin, addAds);
routes.get("/getAds", checkToken, checkAdmin, AllAds);
routes.post("/saveNotification", saveNotification);
routes.get("/sendMessage", sendNotification);

routes.get("/getAllNotifications", getAllNotification);
routes.post("/addSubscriptionPlan", AddMintsPlan);
routes.get("/terminateJob", terminateJob);
routes.get("/allAdmin", checkToken, checkAdmin, AllAdmin);
routes.get("/allSubscriptionPlan", checkToken, checkAdmin, AllMintsPlan);
module.exports = routes;
