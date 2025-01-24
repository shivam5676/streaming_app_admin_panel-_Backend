var admin = require("firebase-admin");

var serviceAccount = require("../reeloid-47c30-firebase-adminsdk-4nweu-d2b75bd806.json");
const {
  addTaskToRejectedDeviceQueue,
} = require("../queue/TaskQueue/Notification/addTaskToRejectedDeviceQueue");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// const { getMessaging } = admin;

exports.sendNotification = (data, usersDeviceList) => {
  console.log(data, usersDeviceList);
  const { title, description } = data;

  try {
    admin
      .messaging()
      .sendEachForMulticast({
        data: {
          title: title || "hello i am from notification testing",
          description:
            description ||
            "hello i am from notification testing team i am testing notification",
          photo: "",
          //   "https://oipl.bitrix24.in/b1291759/resize_cache/367600/a7fa78f57e73ecbd0b9500a062d0d214/main/51c/51c866f6f541cffbb86a4062882d7096/avatar.png",
        },
        tokens: usersDeviceList,
      })
      .then((response) => {
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
        console.log({
          msg: "notification sent successfully",
        });
      })
      .catch((error) => {
        console.log(error);
        console.log("Error sending notification:", error.code, error.message);
      });
  } catch (error) {
    console.log(error);
  }
};
