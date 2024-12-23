var admin = require("firebase-admin");

var serviceAccount = require("../reeloid-fcn-firebase-adminsdk-p7rd5-43d4fb93e4.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// const { getMessaging } = admin;

exports.sendNotification = (req, res) => {
  console.log("first");
  const { title, description } = req.body;
  // title=title.toString()
  console.log(req.usersDeviceList);
  return new Promise((resolve, reject) => {
    admin
      .messaging()
      .sendEachForMulticast({
        data: {
          title: title || "hello i am from notification testing",
          description:
            description ||
            "hello i am from notification tetsting team i am testing notification",
          photo: "",
          //   "https://oipl.bitrix24.in/b1291759/resize_cache/367600/a7fa78f57e73ecbd0b9500a062d0d214/main/51c/51c866f6f541cffbb86a4062882d7096/avatar.png",
        },
        tokens: req.usersDeviceList,
      })
      .then((response) => {
        const rejectedUserIDs = [];
        console.log(
          "Notification sent successfully with message ID:",
          response.responses.forEach((current, index) => {
            console.log(current.success);
            if (current.success == false) {
              console.log(index);
              rejectedUserIDs.push(index);
            }
          })
        );

        resolve({ msg: "notification sent succeffully", rejectedUserIDs });
        // return res.json({ msg: "notification sent successfully" });
      })
      .catch((error) => {
        console.log(error);
        console.log("Error sending notification:", error.code, error.message);
        reject(error);
      });
  });
};
