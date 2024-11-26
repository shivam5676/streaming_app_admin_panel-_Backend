const checkTaskStatus = require("./checkTaskStatus");

const transcodeVideo = (fileId, templateIds, client) => {
  return new Promise((resolve, reject) => {
    console.log("Transcoding start");

    const transcodeParams = {
      FileId: fileId,
      MediaProcessTask: {
        TranscodeTaskSet: templateIds.map((templateId) => ({
          Definition: templateId, // Template ID for transcoding
        })),
      },
      SubAppId: 1326678901, // Optional: Pass SubAppId if applicable
    };

    client.ProcessMedia(transcodeParams, (err, response) => {
      if (err) {
        console.error("Error initiating transcoding:", err);
        reject(err);
      } else {
        console.log("Transcoding initiated successfully:", response);
        resolve(response.TaskId); // Return the fileId
      }
    });
  });
};

// const checkTaskStatus = (taskId, client, pageToken = null) => {
//   return new Promise((resolve, reject) => {
//     const params = {
//       Limit: 20, // Number of tasks to fetch per page
//       PageToken: pageToken || undefined, // Use pagination if provided
//       // Filter: {
//       //   StartTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Start time (last 3 days)
//       // },
//     };

//     client.DescribeTasks(params, (err, response) => {
//       if (err) {
//         console.error("Error fetching task details:", err);
//         return reject(err);
//       }
// console.log(response.ScrollToken,"rererereerrer...............>>>>>>")
// // return
//       const task = response.Data?.find((t) => t.TaskId === taskId);

//       if (task) {
//         console.log("Task found:", task);
//         if (task.Status === "FINISH") {
//           resolve(task); // Task completed
//         } else if (task.Status === "PROCESSING" || task.Status === "WAITING") {
//           console.log("Task is still processing or waiting:", task);
//           setTimeout(() => {
//             checkTaskStatus(taskId, client)
//               .then(resolve)
//               .catch(reject);
//           }, 5000); // Retry after 5 seconds
//         } else {
//           console.error("Task failed or is in an unexpected state:", task);
//           reject(new Error(`Task status: ${task.Status}`));
//         }
//       } else if (response.ScrollToken) {
//         console.log("Task not found on this page. Fetching next page...");
//         checkTaskStatus(taskId, client, response.PageToken)
//           .then(resolve)
//           .catch(reject);
//       } else {
//         console.log("Task not found. Retrying...");
//         setTimeout(() => {
//           checkTaskStatus(taskId, client)
//             .then(resolve)
//             .catch(reject);
//         }, 5000); // Retry after 5 seconds
//       }
//     });
//   });
// };

const getTranscodedUrls = (fileId, client) => {
  console.log("FileId passed to getTranscodedUrls:", fileId);
  return new Promise((resolve, reject) => {
    const params = {
      FileIds: [fileId], // FileId of the uploaded media
      SubAppId: 1326678901, // Optional: Pass SubAppId if applicable
    };

    client.DescribeMediaInfos(params, (err, response) => {
      if (err) {
        console.error("Error retrieving media info:", err);
        reject(err);
      } else {
        console.log(response, "response of urls......>");
        const mediaInfo = response.MediaInfoSet[0];
        const transcodedUrls = mediaInfo.TranscodeInfo.TranscodeSet.map(
          (transcode) => {
            console.log(transcode, "....<<>>>>");
            return {
              Definition: transcode.Definition, // Template ID used for transcoding
              Url: transcode.Url, // Transcoded URL
            };
          }
        );

        resolve(transcodedUrls);
      }
    });
  });
};
const transcodeTencentVideo = (fileId, templateIds, client) => {
  // checkTaskStatus("taskId", client);
   return transcodeVideo(fileId, templateIds, client)
      .then((taskId) => {
        console.log("TaskId from transcodeVideo:", taskId);
        return checkTaskStatus(fileId); // Resolve task from checkTaskStatus
      })
      .then((task) => {
        console.log("Resolved Task from checkTaskStatus:", task);
        return getTranscodedUrls(task.FileId, client); // Pass FileId to getTranscodedUrls
      })
      .then((urls) => {
        console.log("Transcoded URLs:", urls); // Log the resolved URLs

        return  {multipleQualityUrls:urls,fileId:fileId}
      })
      .catch((err) => console.error("Error:", err)); // Catch any errors in the process
};

module.exports = transcodeTencentVideo;
