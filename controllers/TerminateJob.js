const { sendNotificationtoDeviceQueue } = require("../services/bullServices");
const NotificationTasks = require("../models/NotificationTask");

exports.terminateJob = async (req, res) => {
  const taskId = req.query.taskId;
  if (!taskId) {
    return res.status(400).json({ msg: "no task id found ...." });
  }
  try {
    const notificationTask = await NotificationTasks.findById({ _id: taskId });
    if (!notificationTask) {
      return res.status(400).json({ msg: "invalid notification id...." });
    }
    console.log(notificationTask);
    const jobTask = await sendNotificationtoDeviceQueue.getJob(
      notificationTask.jobId
    );
    if (!jobTask) {
      return res.status(400).json({ msg: "no task found" });
    }

    await jobTask.remove();
    await notificationTask.save({ status: "Terminated" });
    return res.status(200).json({ msg: "Task Terminated successfully" });
  } catch (error) {
    return res.status(200).json({ msg: "Something went wrong", err: error });
  }
};
