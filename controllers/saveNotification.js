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


