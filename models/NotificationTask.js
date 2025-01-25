const mongoose = require("mongoose");
const NotificationTasksSchema = new mongoose.Schema({
  title: String,
  startTimeUnix: String,
  endTimeUnix: String,
  description: String,
  target: String,
  status: String,
  repeat: String,
  lastSuccessMessage: String,
  lastErrorMessage: String,
  lastTaskLaunch: String,
  nextTaskLaunch: String,
  jobId: String,
});
const NotificationTasks = mongoose.model(
  "NotificationTask",
  NotificationTasksSchema
);
module.exports = NotificationTasks;
