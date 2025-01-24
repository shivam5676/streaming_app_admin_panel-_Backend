const {
  sendNotificationtoDeviceQueue,
} = require("../../../services/bullServices");

exports.addTaskToSendNotificationDeviceQueue = async (
  dataToSend,
  deviceIds,
  scheduleData
) => {
  try {
    console.log(dataToSend.deviceIds);
    let delay = 0;
    if (scheduleData.startTime <= scheduleData.currentTime) {
      delay = 0;
    } else {
      delay = Math.abs(scheduleData.startTime - scheduleData.currentTime);
    }

 
    console.log(delay,"delay registered")
    const job = await sendNotificationtoDeviceQueue.add(
      { dataToSend, deviceIds },
      { delay: delay }
    ); //deletion will start after 5 sec
    return {
      msg: "job added successfully ....notification will sent on selected time",
    };
  } catch (error) {
    console.log("errro",error)
    throw new Error(error);
  }
};
