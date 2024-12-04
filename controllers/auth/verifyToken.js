const jwt = require("jsonwebtoken");

exports.verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject(err); // Reject the Promise with the error
      } else {
        resolve(decoded); // Resolve the Promise with the decoded payload
      }
    });
  });
};
