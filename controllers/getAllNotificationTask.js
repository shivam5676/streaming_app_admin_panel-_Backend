const NotificationTasks = require("../models/NotificationTask");

exports.getAllNotification = async (req, res, next) => {
  try {
    const response = await NotificationTasks.find();
    return res.status(200).json({ notificationTasks: response });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
