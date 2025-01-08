const Bull = require("bull");
const redisConfig = {
  redis: {
    host: "localhost",//system where redis has been launched if same server then we use localhost or ip of that server
    port: 6379,//port on which redis server is running
  },
};
//bull uses redis behind the scene so we need to install redis and start the redis server on speciic port where u want to run it it can be different then current server port we can use different ip
exports.deleteRejectedDeviceQueue = new Bull(
  "delete-Rejected-Device-Queue",
  redisConfig
);
exports.sendNotificationtoDeviceQueue = new Bull(
  "send-NotficationTo-Device-Queue",
  redisConfig
);
