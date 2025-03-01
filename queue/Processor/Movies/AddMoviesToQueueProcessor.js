const { movieUploadByQueue } = require("../../../controllers/movieUploadByQueue");
const { uploadMoviesQueue } = require("../../../services/bullServices");
exports.AddMoviesToQueueProcessor = () => {
  try {
    uploadMoviesQueue.process((job) => {
      //job will process here
      console.log("job", job, "job.....................>");
      // sendNotification(job.data.dbTaskId, job.data.deviceIds);
      // movieUploadByQueue(job.data);
      // movieUploadByQueue
      movieUploadByQueue(job.data,job.id)
    });
  } catch (error) {
    console.log(error);
  }
};
