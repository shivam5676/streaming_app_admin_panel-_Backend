const tencentcloud = require("tencentcloud-sdk-nodejs");
const COS = require("cos-nodejs-sdk-v5");
const fs = require("fs");

const VodClient = tencentcloud.vod.v20180717.Client;

// Initialize the client with your Tencent Cloud credentials
const clientConfig = {
  credential: {
    secretId: "your-secretId", // Replace with your Tencent Cloud SecretId
    secretKey: "your-secretKey", // Replace with your Tencent Cloud SecretKey
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
function uploadVideo(videoFilePath) {
  const params = {
    MediaType: "video", // The type of media you're uploading
    SubAppId: 1500033163, // Optional: Pass SubAppId if applicable
  };

  // Step 1: Apply for upload
  client.ApplyUpload(params, (err, response) => {
    if (err) {
      console.error("Error applying for upload:", err);
      return;
    }

    const { StorageBucket, StorageRegion, VodSessionKey, MediaStoragePath } = response;

    // Step 2: Upload video to COS using the information from ApplyUpload
    const cos = new COS({
      SecretId: clientConfig.credential.secretId,
      SecretKey: clientConfig.credential.secretKey,
    });

    const uploadParams = {
      Bucket: StorageBucket,
      Region: StorageRegion,
      Key: MediaStoragePath,
      Body: fs.createReadStream(videoFilePath), // Read video file
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
          } else {
            console.log("Upload committed successfully:", commitResponse);
          }
        });
      }
    });
  });
}

// Example usage
const uploadVideoToTencent = () => {
  uploadVideo("uploads/shorts/appsgolem_1728276998210.mp4");
};

// Export the function
module.exports = uploadVideoToTencent;