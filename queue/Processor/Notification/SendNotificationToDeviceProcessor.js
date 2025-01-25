const { sendNotification } = require("../../../controllers/sendNotification");
const {
  sendNotificationtoDeviceQueue,
} = require("../../../services/bullServices");

exports.SendNotificationToDeviceProcessor = () => {
  sendNotificationtoDeviceQueue.process((job) => {
    //job will process here 
    console.log(job)
    sendNotification(job.data.dbTaskId, job.data.deviceIds);
  });
};
