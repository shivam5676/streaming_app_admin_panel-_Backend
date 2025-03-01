const { uploadMoviesQueue } = require("../../../services/bullServices");

exports.addTaskToMovieUploadQueue = async (data) => {
  try {
    console.log("data", data);
    const job = await uploadMoviesQueue.add(data);
     console.log(job)
    return {
      msg: "job added successfully ...shorts will upload soon",
      jobId: job.id,
    };
  } catch (error) {
    console.log("error", error);
    throw new Error(error);
  }
};
