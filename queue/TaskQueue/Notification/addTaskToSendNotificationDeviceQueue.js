const {
  sendNotificationtoDeviceQueue,
} = require("../../../services/bullServices");

exports.addTaskToSendNotificationDeviceQueue = async (
  dataToSend,
  deviceIds
) => {
  try {
    console.log(dataToSend.deviceIds);
    const delay = 5000; //ms
    const job = await sendNotificationtoDeviceQueue.add(
      { dataToSend, deviceIds },
      { delay: delay }
    ); //deletion will start after 5 sec
    return {
      msg: "job added successfully ....notification will sent on selected time",
    };
  } catch (error) {
    throw new Error(error);
  }
};
