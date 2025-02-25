const NotificationTasks = require("../models/NotificationTask");

const Users = require("../models/Users");

const {
  addTaskToSendNotificationDeviceQueue,
} = require("../queue/TaskQueue/Notification/addTaskToSendNotificationDeviceQueue");

exports.saveNotification = async (req, res) => {
  const { title, description, startDate, startTime, endDate, endTime } =
    req.body;
  console.log(title, description, startDate, startTime, endDate, endTime);
  if (!title) {
    return res.status(400).json({ msg: "title is empty!!!" });
  }
  if (!description) {
    return res.status(400).json({ msg: "description is empty!!!" });
  }
  if (!startDate) {
    return res.status(400).json({ msg: "startDate is empty!!!" });
  }
  if (!startTime) {
    return res.status(400).json({ msg: "startTime is empty!!!" });
  }
  if (!endDate) {
    return res.status(400).json({ msg: "endDate is empty!!!" });
  }
  if (!endTime) {
    return res.status(400).json({ msg: "endTime is empty!!!" });
  }

  //changing data and time to unix value so that i could pass it to notification launcher also i will do for end date and time and pass it as end datae so that any user or location will get these notoification till end date end tim e,from start dat eand start time
  function unixTimeConversion(date, time) {
    const datTimeString = `${date} ${time}`;
    return new Date(datTimeString).getTime();
    // console.log(new Date(datTimeString).getTime()); //changing data and time to unix value so that i could pass it to notification launcher also i will do for end date and time and pass it as end datae so that any user or location will get these notoification till end date end tim e,from start dat eand start time
  }

  // return;

  //changing data and time to unix value so that i could pass it to notification launcher also i will do for end date and time and pass it as end datae so that any user or location will get these notoification till end date end tim e,from start dat eand start time
  function unixTimeConversion(date, time) {
    const datTimeString = `${date} ${time}`;
    return new Date(datTimeString).getTime();
    // console.log(new Date(datTimeString).getTime()); //changing data and time to unix value so that i could pass it to notification launcher also i will do for end date and time and pass it as end datae so that any user or location will get these notoification till end date end tim e,from start dat eand start time
  }
  const startTimeAndDateString = unixTimeConversion(startDate, startTime);
  const endTimeAndDateString = unixTimeConversion(endDate, endTime);
  const currentTimeAndDateString = Math.floor(new Date().getTime() / 1000);
  const roundedCurrentTimeAndDateString =
    Math.floor(currentTimeAndDateString / 60) * 60 * 1000; //rounding to minutes not taking millisecond
  const gracePeriod = 120000;
  console.log(
    startTimeAndDateString,
    endTimeAndDateString,

    roundedCurrentTimeAndDateString
  );
  if (startTimeAndDateString < roundedCurrentTimeAndDateString - gracePeriod) {
    return res
      .status(400)
      .json({ msg: "start time can not less than current time" });
  }

  // return;

  try {
    // const response = await sendNotification(req, res);
    const fetchUserForNotification = await Users.find(
      { Devices: { $exists: true } },
      { Devices: 1, _id: 0 }
    );

    const deviceIds = fetchUserForNotification
      .map((user) => {
        return user.Devices.map((device) => {
          return device.fcmtoken;
        });
      })
      .flat();

    req.usersDeviceList = deviceIds;
    const notificationTask = await NotificationTasks.create({
      title: title,
      startTimeUnix: startTimeAndDateString,
      endTimeUnix: endTimeAndDateString,
      description: description,
      target:
        "location/user/or anything else we will run a query for targeting device by target ,we need to remove visible an dadd target audience (location,user or any thing else also we can a select option for location ip /city ,same for user if need  in frontend) also we can add notification Visibilty option(hourly,daily once ,daily morning ,evening,afternoon monthly)",
      status: "Pending",
      repeat: "Minute",
      lastSuccessMessage: "Added",
      lastErrorMessage: "no error",
      lastTaskLaunch: "latest completed task date or we will use -",
      nextTaskLaunch:
        "upcoming  task date or we will use no upcoming task message after calculating starting ending date",
    });

    if (!notificationTask) {
      throw new Error("could not cretaed the task in database");
    }
    let delay = 0;
    if (startTimeAndDateString <= roundedCurrentTimeAndDateString) {
      delay = 0;
    } else {
      delay = Math.abs(
        startTimeAndDateString - roundedCurrentTimeAndDateString
      );
    }
    console.log(deviceIds)
    const response = await addTaskToSendNotificationDeviceQueue(
      notificationTask._id,
      deviceIds,
      delay
    );
    return res.status(200).json({ msg: response.msg });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ msg: "something went wrong ....", err: err });
  }
};
