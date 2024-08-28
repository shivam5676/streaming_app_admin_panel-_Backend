const express = require("express");
const cors = require("cors");
const path=require("path")
const connectDb = require("./util/database");

const app = express();connectDb();
app.use(cors())
app.use(express.json())
app.use('/thumbnails', express.static(path.join(__dirname, 'uploads', 'thumbnail')));
console.log(path.join(__dirname, 'uploads', 'thumbnail'))
const adminRoutes = require("./routes/admin");

app.use("/admin", adminRoutes);


app.listen(8765, () => {
  console.log("app is running on server 8765");
});
