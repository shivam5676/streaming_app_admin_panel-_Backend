const tencentcloud = require("tencentcloud-sdk-nodejs");
const COS = require("cos-nodejs-sdk-v5");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const transcodeTencentVideo = require("../controllers/transcodeVideo");
// const videoFilePath = path.join(
//   __dirname,
//   "..",
//   "uploads",
//   "shorts",
//   "v_1728366358273.mp4"
// ); // Use __dirname for current directory
// console.log(videoFilePath);

const VodClient = tencentcloud.vod.v20180717.Client;

// Initialize the client with your Tencent Cloud credentials
const clientConfig = {
  credential: {
    secretId: "IKID67v3DII5iEYikhhmy37DKH8tUxGi4FG6", // Replace with your Tencent Cloud SecretId
    secretKey: "87uDH7mNm3DA5ta6RcaMxKVUIsENIFBt", // Replace with your Tencent Cloud SecretKey
  },
  region: "ap-hongkong", // Correct region
  profile: {
    httpProfile: {
      endpoint: "vod.tencentcloudapi.com",
    },
  },
};

const client = new VodClient(clientConfig);

// Function to upload a video
function uploadVideo(videoFile) {
  return new Promise((resolve, reject) => {
    const params = {
      MediaType: "MP4", // The type of media you're uploading
      SubAppId: 1326678901, // Optional: Pass SubAppId if applicable
    };

    // Step 1: Apply for upload
    client.ApplyUpload(params, (err, response) => {
      if (err) {
        console.error("Error applying for upload:", err);
        return;
      }
      console.log(response, "response...........>");
      const { StorageBucket, StorageRegion, VodSessionKey, MediaStoragePath } =
        response;

      // Step 2: Upload video to COS using the information from ApplyUpload
      const cos = new COS({
        SecretId: response.TempCertificate.SecretId,
        SecretKey: response.TempCertificate.SecretKey,
        XCosSecurityToken: response.TempCertificate.Token, // Add this token
      });
      console.log(videoFile, "vfilke")
      const uploadParams = {
        Bucket: StorageBucket,
        Region: StorageRegion,
        Key: MediaStoragePath,
        // Body: fs.createReadStream(videoFilePath), // Read video file
        Body: videoFile
      };

      cos.putObject(uploadParams, (uploadErr, uploadData) => {
        if (uploadErr) {
          console.error("Error uploading video:", uploadErr);
        } else {
          console.log("Video uploaded successfully:", uploadData);

          // Step 3: Commit the upload
          const commitParams = {
            VodSessionKey: VodSessionKey,
          };

          client.CommitUpload(commitParams, (commitErr, commitResponse) => {
            if (commitErr) {
              console.error("Error committing upload:", commitErr);
              reject(commitErr)
            } else {
              console.log("Upload committed successfully:", commitResponse);
              resolve({MediaUrl:commitResponse.MediaUrl,FileId:commitResponse.FileId})


            }
          });
        }
      });
    });
  })

}

// Example usage
const uploadVideoToTencent = (video) => {
  // return uploadVideo(video)
  return uploadVideo(video).then((videoData) => {
    console.log(videoData, "promise")
    const fileId = videoData.FileId; // Extract FileId
    // const templateIds = [101302, 101305, 101308];
    transcodeTencentVideo(fileId,[101302, 101305, 101308],client)
    return videoData
  }).catch(err => console.log(err))
};


// Export the function
module.exports = uploadVideoToTencent;
