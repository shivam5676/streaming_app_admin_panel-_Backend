const Users = require("../models/Users");
const { sendNotification } = require("./sendNotification");

exports.saveNotification = async (req, res) => {
  try {
    // const response = await sendNotification(req, res);
    const fetchUserForNotification = await Users.find(
      { Devices: { $exists: true } },
      { Devices: 1, _id: 0 }
    );
    // for (currentIndex in fetchUserForNotification) {
    //   fetchUserForNotification[currentIndex].Devices;
    // }
    const deviceIds = fetchUserForNotification
      .map((user) => {
        return user.Devices.map((device) => {
          console.log(device.fcmtoken, "cu>>>>>>>>");
          return device.fcmtoken;
        });
      })
      .flat();
    console.log(deviceIds);
    // const userDevices = [];
    req.usersDeviceList = deviceIds;
    const response = await sendNotification(req, res);
    
    // return;
    const rejectedUserList=response.rejectedUserIDs.map(currentIndex=>{
        return deviceIds[currentIndex]
    })
    console.log(rejectedUserList);
    return res.status(200).json({msg:"notified successfully"});
  } catch (err) {
    console.log(err);
  }
};
