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



const checkTaskStatus = (taskId, client) => {
  return new Promise((resolve, reject) => {
    client.DescribeTasks(
      {
        Limit: 1000000, // Limit the result to one task
      },
      (err, response) => {
        if (err) {
          console.error("Error fetching task details:", err);
          return reject(err);
        }

        const task = response.TaskSet.find((t) => {
          console.log({ taskId: t.TaskId, fileId: t.FileId }, "tttttt", taskId);
          return t.TaskId === taskId;
        });

        if (!task) {
          console.error("Task not found:", taskId);
          return reject(new Error(`Task with ID ${taskId} not found`));
        }

        console.log("Task Details:", task);

        // Check task status
        if (task.Status === "FINISH") {
          console.log("Task completed successfully:", task);
          resolve(task);
        } else if (task.Status === "PROCESSING" || task.Status === "WAITING") {
          console.log("Task is still processing or waiting:", task);
          setTimeout(() => {
            checkTaskStatus(taskId, client)
              .then(resolve) // Continue the promise chain
              .catch(reject); // Handle errors in the recursive chain
          }, 5000);
        } else {
          console.error("Task failed or is in an unexpected state:", task);
          reject(new Error(`Task status: ${task.Status}`));
        }
      }
    );
  });
};

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
 return transcodeVideo(fileId, templateIds, client)
    .then((taskId) => {
      console.log("TaskId from transcodeVideo:", taskId);
      return checkTaskStatus(taskId, client); // Resolve task from checkTaskStatus
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
