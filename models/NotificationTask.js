const mongoose = require("mongoose");
const NotificationTasksSchema = new mongoose.Schema({
  title: String,
  startTimeUnix: String,
  endTimeUnix: String,
  description: String,
  target: String,
  status: String,
  lastSuccessMessage: String,
  lastErrorMessage: String,
});
 const NotificationTasks=mongoose.model("NotificationTask",NotificationTasksSchema)
 module.exports=NotificationTasks
