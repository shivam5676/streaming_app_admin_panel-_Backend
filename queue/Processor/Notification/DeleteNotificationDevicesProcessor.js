const Users = require("../../../models/Users");
const { deleteRejectedDeviceQueue } = require("../../../services/bullServices");

exports.DeleteNotificationDeviceProcessor = async () => {
  try {
    deleteRejectedDeviceQueue.process(async (job) => {
      try {
        console.log("after some time it started finally")
        const rejectedDeviceTokenArray = job.data;

        const response = await Users.updateMany(
          { "Devices.fcmtoken": { $in: rejectedDeviceTokenArray } },
          {
            $pull: { Devices: { fcmtoken: { $in: rejectedDeviceTokenArray } } },
          }
        );
      } catch (error) {
        console.error("Error in queue processing:", error);
      }
    });
  } catch (error) {
    console.error("Error in setting up queue processor:", error);
  }
};
