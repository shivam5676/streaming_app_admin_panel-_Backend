const Users = require("../models/Users");
const { deleteRejectedDeviceQueue } = require("../services/bullServices");
const { deleteDeactivatedDevices } = require("./deleteDeactivatedDevices");
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
          console.log(device.fcmtoken, "cu>>>>>>>>");
          return device.fcmtoken;
        });
      })
      .flat();
    console.log(deviceIds);
    // const userDevices = [];
    req.usersDeviceList = deviceIds;
    const response = await sendNotification(req, res);

    // return;
    const rejectedDeviceTokens = response.rejectedUserIDs.map(
      (currentIndex) => {
        return deviceIds[currentIndex];
      }
    );

    async function addTaskToBackgroundQueue(data) {
      const job = await deleteRejectedDeviceQueue.add(data, { delay: 60000 });
    }
    addTaskToBackgroundQueue(rejectedDeviceTokens);

    // deleteDeactivatedDevices(rejectedUserList);
    return res.status(200).json({ msg: "notified successfully" });
  } catch (err) {
    console.log(err);
  }
};

deleteRejectedDeviceQueue.on("waiting", (jobId) => {
  console.log(`Job with ID ${jobId} is waiting to be processed.`);
});
deleteRejectedDeviceQueue.process(async (job) => {
  const rejectedDeviceTokenArray = job.data;
  console.log(rejectedDeviceTokenArray, "job is here");
  await Users.updateMany(
    { "Devices.fcmtoken": { $in: rejectedDeviceTokenArray } },
    { $pull: { Devices: { fcmtoken: { $in: rejectedDeviceTokenArray } } } }
  );
});
