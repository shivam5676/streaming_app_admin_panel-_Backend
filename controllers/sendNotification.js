var admin = require("firebase-admin");

var serviceAccount = require("../reeloid-fcn-firebase-adminsdk-p7rd5-43d4fb93e4.json");
const {
  addTaskToRejectedDeviceQueue,
} = require("../queue/TaskQueue/Notification/addTaskToRejectedDeviceQueue");
const NotificationTasks = require("../models/NotificationTask");
const {
  addTaskToSendNotificationDeviceQueue,
} = require("../queue/TaskQueue/Notification/addTaskToSendNotificationDeviceQueue");
const { sendNotificationtoDeviceQueue } = require("../services/bullServices");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// const { getMessaging } = admin;

exports.sendNotification = async (dbTaskId, usersDeviceList) => {
  // console.log(data,usersDeviceList)

  // return
  const fetchTask = await NotificationTasks.findById({ _id: dbTaskId });
  const currentTimeAndDateString = Math.floor(new Date().getTime() / 1000);
  const roundedCurrentTimeAndDateString =
    Math.floor(currentTimeAndDateString / 60) * 60 * 1000; //rounding to minutes not taking millisecond
  // const scheduleTask = 24 * 60 * 60 * 1000;
  let delay = 0;
  // const { title, description } = data;

  try {
    admin
      .messaging()
      .sendEachForMulticast({
        data: {
          title: fetchTask.title || "hello i am from notification testing",
          description:
            fetchTask.description ||
            "hello i am from notification testing team i am testing notification",
          photo: "",
          //   "https://oipl.bitrix24.in/b1291759/resize_cache/367600/a7fa78f57e73ecbd0b9500a062d0d214/main/51c/51c866f6f541cffbb86a4062882d7096/avatar.png",
        },
        tokens: usersDeviceList,
      })
      .then(async (response) => {
        const rejectedUserIDsIndex = [];
        response.responses.forEach((current, index) => {
          if (current.success == false) {
            rejectedUserIDsIndex.push(index);
          }
        });

        const rejectedDeviceTokens = rejectedUserIDsIndex.map(
          (currentIndex) => {
            return usersDeviceList[currentIndex];
          }
        );
        // addTaskToRejectedDeviceQueue(rejectedDeviceTokens);
        if (fetchTask) {
          if (fetchTask.repeat === "Minute") {
            const scheduleTask = 60 * 1000;
            if (
              roundedCurrentTimeAndDateString + scheduleTask <=
              fetchTask.endTimeUnix
            ) {
              delay = scheduleTask;
            }

            if (delay > 0) {
              const nextScheduleDate =
                roundedCurrentTimeAndDateString + scheduleTask;
              // const previousScheduleDAte=roundedCurrentTimeAndDateString
              const response = await addTaskToSendNotificationDeviceQueue(
                fetchTask._id,
                usersDeviceList,
                delay
              );

              fetchTask.jobId = response.jobId;

              fetchTask.nextTaskLaunch = new Date(
                nextScheduleDate
              ).toLocaleString();
              fetchTask.lastTaskLaunch = new Date(
                roundedCurrentTimeAndDateString
              ).toLocaleString();
              (fetchTask.lastSuccessMessage = `notified successfully and added  Notification  for next schedule (IST time)- ${new Date(
                roundedCurrentTimeAndDateString
              ).toLocaleString()}`),
                await fetchTask.save();
            } else {
              fetchTask.nextTaskLaunch = null;
              fetchTask.status = "completed";
              fetchTask.lastTaskLaunch = new Date(
                roundedCurrentTimeAndDateString
              ).toLocaleString();
              fetchTask.lastSuccessMessage = `notified successfully and  No New  Notification Left for schedule (IST time)- ${new Date(
                roundedCurrentTimeAndDateString
              ).toLocaleString()}`;
              await fetchTask.save();
            }
          }
          if (fetchTask.repeat === "Weekly") {
            const scheduleTask = 7 * 24 * 60 * 60 * 1000;
            if (
              roundedCurrentTimeAndDateString + scheduleTask <=
              fetchTask.endTimeUnix
            ) {
              delay = scheduleTask;
            }
            console.log(delay, "delay");
            if (delay > 0) {
              const nextScheduleDate =
                roundedCurrentTimeAndDateString + scheduleTask;
              // const previousScheduleDAte=roundedCurrentTimeAndDateString
              const response = addTaskToSendNotificationDeviceQueue(
                fetchTask._id,
                usersDeviceList,
                delay
              );
              fetchTask.jobId = response.jobId;
              fetchTask.nextTaskLaunch = new Date(
                nextScheduleDate
              ).toLocaleString();
              fetchTask.lastTaskLaunch = new Date(
                roundedCurrentTimeAndDateString
              ).toLocaleString();
              (fetchTask.lastSuccessMessage = `notified successfully and added  Notification  for next schedule - ${new Date(
                roundedCurrentTimeAndDateString
              ).toLocaleString()}`),
                await fetchTask.save();
            } else {
              fetchTask.nextTaskLaunch = null;
              fetchTask.status = "completed";
              fetchTask.lastTaskLaunch = new Date(
                roundedCurrentTimeAndDateString
              ).toLocaleString();
              fetchTask.lastSuccessMessage = `notified successfully and No New  Notification Left for schedule- ${new Date(
                roundedCurrentTimeAndDateString
              ).toLocaleString()}`;
              await fetchTask.save();
            }
          }
        }

        console.log({
          msg: "notification sent successfully",
        });
      })
      .catch(async (error) => {
        console.log(error);
        fetchTask.lastErrorMessage ==
          `Error in sending Notification --- ${error.message}   - ${new Date(
            roundedCurrentTimeAndDateString
          ).toLocaleString()}`;
        fetchTask.nextTaskLaunch = null;
        fetchTask.status = "error";
        fetchTask.lastTaskLaunch = roundedCurrentTimeAndDateString;
        await fetchTask.save();
        console.log("Error sending notification:", error.code, error.message);
      });
  } catch (error) {
    console.log(error);
  }
};
