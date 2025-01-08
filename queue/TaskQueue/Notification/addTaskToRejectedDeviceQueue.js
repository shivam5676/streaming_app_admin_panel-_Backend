const { deleteRejectedDeviceQueue } = require("../../../services/bullServices");

exports.addTaskToRejectedDeviceQueue = async (taskData) => {
  const delay = 10000; //ms
  try {
    const job = await deleteRejectedDeviceQueue.add(taskData, { delay: delay }); //deletion will start after 5 sec
    console.log(`deletion will started after ${delay}`);
    return job;
  } catch (error) {
    throw new Error(error);
  }
};
