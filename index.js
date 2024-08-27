const express = require("express");
const cors = require("cors");
const connectDb = require("./util/database");

const app = express();
const adminRoutes = require("./routes/admin");
connectDb();
app.use(cors())
app.use(express.json())
app.use("/admin", adminRoutes);


app.listen(8765, () => {
  console.log("app is running on server 8765");
});
