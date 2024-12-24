const Bull = require("bull");
const redisConfig = {
  redis: {
    host: "localhost",
    port: 6379,
  },
};
//bull uses redis behind the scene so we need to install redis and start the redis server on speciic port where u want to run it it can be different then current server port we can use different ip
exports.deleteRejectedDeviceQueue = new Bull(
  "delete-Rejected-Device-Queue",
  redisConfig
);
