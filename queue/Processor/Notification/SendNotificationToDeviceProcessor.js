const { sendNotification } = require("../../../controllers/sendNotification");
const {
  sendNotificationtoDeviceQueue,
} = require("../../../services/bullServices");

exports.SendNotificationToDeviceProcessor = () => {
  sendNotificationtoDeviceQueue.process((job) => {
    //job will process here 
    sendNotification(job.data.dataToSend, job.data.deviceIds);
  });
};
