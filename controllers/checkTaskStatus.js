const tencentcloud = require("tencentcloud-sdk-nodejs");

// Import the VOD and STS clients
const VodClient = tencentcloud.vod.v20180717.Client;
const StsClient = tencentcloud.sts.v20180813.Client;

// Permanent credentials for generating temporary credentials
const permanentCredential = {
  secretId: "IKID67v3DII5iEYikhhmy37DKH8tUxGi4FG6", // Replace with your Tencent Cloud SecretId
  secretKey: "87uDH7mNm3DA5ta6RcaMxKVUIsENIFBt", // Replace with your Tencent Cloud SecretKey
};

// Function to generate temporary credentials
const generateTemporaryCredentials = () => {
  return new Promise((resolve, reject) => {
    const stsClient = new StsClient({
      credential: permanentCredential,
      region: "ap-hongkong",
    });

    const policy = {
      version: "2.0",
      statement: [
        {
          action: ["vod:DescribeTasks"],
          effect: "allow",
          resource: "*",
        },
      ],
    };

    const params = {
      Name: "VODTemporarySession",
      DurationSeconds: 3600, // 1 hour validity
      Policy: JSON.stringify(policy),
    };

    stsClient.GetFederationToken(params, (err, response) => {
      if (err) {
        console.error("Error generating temporary credentials:", err);
        return reject(err);
      }
      resolve(response.Credentials);
    });
  });
};

// Function to fetch task details using DescribeTasks API
const fetchTaskDetails = async (fileId, finishTimeAfter, finishTimeBefore) => {
    if(!fileId){
        throw new Error("no file id");
        
    }
  try {
    // Generate temporary credentials
    const tempCredentials = await generateTemporaryCredentials();

    // Initialize the VOD client
    const vodClient = new VodClient({
      credential: {
        secretId: tempCredentials.TmpSecretId,
        secretKey: tempCredentials.TmpSecretKey,
        token: tempCredentials.Token,
      },
      region: "ap-hongkong", // Adjust to your region
      profile: {
        httpProfile: {
          endpoint: "vod.tencentcloudapi.com",
        },
      },
    });

    // Define the request parameters
    const params = {
      FileId: fileId,
      //   FinishTime: {
      //     After: finishTimeAfter,
      //     Before: finishTimeBefore,
      //   },
      Sort: {
        Order: "Desc",
      },
      Limit: 20, // Adjust limit as needed
    };

    // Send the DescribeTasks request
    const response = await vodClient.DescribeTasks(params);
    console.log("DescribeTasks Response:", response);

    return response;
  } catch (error) {
    console.error("Error fetching task details:", error);
    throw error;
  }
};

// Main function to check task status
const checkTaskStatus = async (fileId, finishTimeAfter, finishTimeBefore) => {
  return new Promise(async (resolve, reject) => {
    try {
      const taskDetails = await fetchTaskDetails(
        fileId,
        finishTimeAfter,
        finishTimeBefore
      );

      // Check if tasks exist and process them
      if (taskDetails.TaskSet.length===0) {

        // console.error("Task not found:", taskId);
        // return reject(new Error(`Task with ID ${taskId} not found`));
        setTimeout(() => {
            checkTaskStatus(fileId)
              .then(resolve) // Continue the promise chain
              .catch(reject); // Handle errors in the recursive chain
          }, 5000);
      }
      console.log("Task Details:", taskDetails.TaskSet.length);
      // Check task status
      for (const task of taskDetails.TaskSet) {
        if (task.Status === "FINISH") {
          console.log("Task completed successfully:", task);
          resolve(task);
        } else if (task.Status === "PROCESSING" || task.Status === "WAITING") {
          console.log("Task is still processing or waiting:", task);
          setTimeout(() => {
            checkTaskStatus(fileId)
              .then(resolve) // Continue the promise chain
              .catch(reject); // Handle errors in the recursive chain
          }, 5000);
        } else {
          console.error("Task failed or is in an unexpected state:", task);
          reject(new Error(`Task status: ${task?.Status || ""}`));
        }
      }

      // if (taskDetails.TaskSet && taskDetails.TaskSet.length > 0) {
      //   for (const task of taskDetails.TaskSet) {
      //     console.log(`TaskId: ${task.TaskId}, Status: ${task.Status}`);
      //     if (task.Status === "FINISH") {
      //       console.log("Task finished successfully:", task);
      //     } else if (task.Status === "PROCESSING" || task.Status === "WAITING") {
      //       console.log("Task is still processing or waiting:", task);
      //     } else {
      //       console.error("Task failed or in an unexpected state:", task);
      //     }
      //   }
      // } else {
      //   console.log("No tasks found for the specified criteria.");
      // }
    } catch (error) {
      console.error("Error in checkTaskStatus:", error);
    }
  });
};

// Example usage
// const fileId = "43323243"; // Replace with your file ID
// const finishTimeAfter = "2020-09-07T00:00:00+08:00";
// const finishTimeBefore = "2020-09-07T23:59:59+08:00";

// checkTaskStatus(fileId, finishTimeAfter, finishTimeBefore);
module.exports = checkTaskStatus;
