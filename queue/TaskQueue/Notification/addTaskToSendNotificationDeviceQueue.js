const {
  sendNotificationtoDeviceQueue,
} = require("../../../services/bullServices");

exports.addTaskToSendNotificationDeviceQueue = async (
  dbTaskId,
  deviceIds,
  delay
) => {
  try {
    //  console.log(dbTaskId,scheduleData)
    //  return
    // let delay = 0;
    // if (scheduleData.startTime <= scheduleData.currentTime) {
    //   delay = 0;
    // } else {
    //   delay = Math.abs(scheduleData.startTime - scheduleData.currentTime);
    // }

    console.log(delay, "delay registered", dbTaskId);
    const job = await sendNotificationtoDeviceQueue.add(
      { dbTaskId: dbTaskId, deviceIds },
      { delay: delay }
    ); //deletion will start after 5 sec
    
    return {
      msg: "job added successfully ....notification will sent on selected time",
      jobId: job.id,
    };
  } catch (error) {
    console.log("errro", error);
    throw new Error(error);
  }
};
