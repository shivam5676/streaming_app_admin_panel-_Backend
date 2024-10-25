const mongoose = require("mongoose");
const DailyCheckInTaskSchema = new mongoose.Schema({
  assignedUser: String,
  assignedTaskId: String,
//   Type: String,
  status:String//pending,completed,alloted,missed
  //pending mwans task is alloted for and user can check in and get bonus
  //alloted means task is alloted to user but he can not get checked in bonus like upcoming task
  //missed means user missed the pending task in the accepting time frame
});
const dailyCheckInTask = mongoose.model(
  "dailyCheckInTask",
  DailyCheckInTaskSchema
);
module.exports = dailyCheckInTask;
