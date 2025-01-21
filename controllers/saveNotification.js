const Users = require("../models/Users");
const {
  addTaskToRejectedDeviceQueue,
} = require("../queue/TaskQueue/Notification/addTaskToRejectedDeviceQueue");
const {
  addTaskToSendNotificationDeviceQueue,
} = require("../queue/TaskQueue/Notification/addTaskToSendNotificationDeviceQueue");
const { deleteRejectedDeviceQueue } = require("../services/bullServices");
// const addTaskToRejectedDeviceQueue = require("../queue/TaskQueue/Notification/addTaskToRejectedDeviceQueue");
const { sendNotification } = require("./sendNotification");

exports.saveNotification = async (req, res) => {
  const { title, description, startDate, startTime, endDate, endTime } =
    req.body;
  console.log(title, description, startDate, startTime, endDate, endTime);
  if (!title) {
    return res.status(400).json({ msg: "title is empty!!!" });
  }
  if (!description) {
    return res.status(400).json({ msg: "description is empty!!!" });
  }
  if (!startDate) {
    return res.status(400).json({ msg: "startDate is empty!!!" });
  }
  if (!startTime) {
    return res.status(400).json({ msg: "startTime is empty!!!" });
  }
  if (!endDate) {
    return res.status(400).json({ msg: "endDate is empty!!!" });
  }
  if (!endTime) {
    return res.status(400).json({ msg: "endTime is empty!!!" });
  }
  const datTimeString = `${startDate} ${startTime}`;
  console.log(new Date(datTimeString).getTime()); //changing data and time to unix value so that i could pass it to notification launcher also i will do for end date and time and pass it as end datae so that any user or location will get these notoification till end date end tim e,from start dat eand start time
  return;
  try {
    // const response = await sendNotification(req, res);
    const fetchUserForNotification = await Users.find(
      { Devices: { $exists: true } },
      { Devices: 1, _id: 0 }
    );

    const deviceIds = fetchUserForNotification
      .map((user) => {
        return user.Devices.map((device) => {
          return device.fcmtoken;
        });
      })
      .flat();

    req.usersDeviceList = deviceIds;

    const response = await addTaskToSendNotificationDeviceQueue(
      req.body,
      deviceIds
    );

    return res.status(200).json({ msg: response.msg });
  } catch (err) {
    console.log(err);
  }
};
