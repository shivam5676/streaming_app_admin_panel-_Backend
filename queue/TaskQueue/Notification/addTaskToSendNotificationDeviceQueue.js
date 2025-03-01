const {
  sendNotificationtoDeviceQueue,
} = require("../../../services/bullServices");

exports.addTaskToSendNotificationDeviceQueue = async (
  dbTaskId,
  deviceIds,
  delay
) => {
  try {
    console.log(delay, "delay registered", dbTaskId);
    const job = await sendNotificationtoDeviceQueue.add(
      { dbTaskId: dbTaskId, deviceIds },
      { delay: delay }
    ); 

    return {
      msg: "job added successfully ....notification will sent on selected time",
      jobId: job.id,
    };
  } catch (error) {
    console.log("errro", error);
    throw new Error(error);
  }
};
