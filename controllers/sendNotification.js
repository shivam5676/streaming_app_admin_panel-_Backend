var admin = require("firebase-admin");

var serviceAccount = require("../reeloid-fcn-firebase-adminsdk-p7rd5-43d4fb93e4.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// const { getMessaging } = admin;

exports.sendNotification = (req, res) => {
  admin
    .messaging()
    .send({
      data: {
        title: "New Movies Are Coming : Salaar",
        description: "Click here to know when it is getiing released",
        photo:""
        //   "https://oipl.bitrix24.in/b1291759/resize_cache/367600/a7fa78f57e73ecbd0b9500a062d0d214/main/51c/51c866f6f541cffbb86a4062882d7096/avatar.png",
      },
      token:
        "eu-zFijAREagtj2Rc9Ok8C:APA91bHVBMPzmKoC4FSuHYLNd7NMgvoZs1kSpcrjJ005BunvnEz6lrUi-v3JEx1fMwbSIn_JUC8BHKlExbZ5hO4JGfnQS-WXjZwocKne9plg9J00iJKKDdo",
    })
    .then((response) => {
      console.log("Notification sent successfully with message ID:", response);
      return res.json({ msg: "notification sent succeffully" });
    })
    .catch((error) => {
      console.error("Error sending notification:", error.code, error.message);
    });
};
