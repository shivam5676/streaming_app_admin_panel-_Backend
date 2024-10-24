const express = require("express");
const cors = require("cors");
const path=require("path")
const connectDb = require("./util/database");

const app = express();
connectDb();

app.use(express.json())
app.use('/thumbnails', express.static(path.join(__dirname, 'uploads', 'thumbnail')));
app.use('/video', express.static(path.join(__dirname, 'uploads', 'shorts')))
app.use('/genreIcon', express.static(path.join(__dirname, 'uploads', 'genreImage')))
console.log(express.static(path.join(__dirname, 'uploads', 'genreImage')))
console.log(path.join(__dirname, 'uploads', 'shorts',"v_1728366358273.mp4"))
app.use(cors({origin:"*"}))
const adminRoutes = require("./routes/admin");

app.use("/admin", adminRoutes);

app.listen(8765, () => {
  console.log("app is running on server 8765");
});
