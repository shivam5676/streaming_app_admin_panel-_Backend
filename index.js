const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDb = require("./util/database");
require("./models/Admin");
require("./models/DailyCheckInTask");
require("./models/Layout");
require("./models/Movies");
require("./models/Shorts");
require("./models/Slider");
require("./models/Users");
require("./models/genre");
require("./models/language");
require("./models/checkInPoints");
const app = express();
connectDb();

app.use(express.json());
app.use(
  "/thumbnails",
  express.static(path.join(__dirname, "uploads", "thumbnail"))
);
app.use("/video", express.static(path.join(__dirname, "uploads", "shorts")));
app.use(
  "/genreIcon",
  express.static(path.join(__dirname, "uploads", "genreImage"))
);

app.use(cors({ origin: "*" }));
const adminRoutes = require("./routes/admin");
const {
  DeleteNotificationDeviceProcessor,
} = require("./queue/Processor/Notification/DeleteNotificationDevicesProcessor");
const {
  SendNotificationToDeviceProcessor,
} = require("./queue/Processor/Notification/SendNotificationToDeviceProcessor");
const { AddMoviesToQueueProcessor } = require("./queue/Processor/Movies/AddMoviesToQueueProcessor");
DeleteNotificationDeviceProcessor();
SendNotificationToDeviceProcessor();
AddMoviesToQueueProcessor()
app.use("/admin", adminRoutes);

app.listen(8765, () => {
  console.log("app is running on server 8765");
});
