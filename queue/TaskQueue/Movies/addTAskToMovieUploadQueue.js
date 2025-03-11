const Movies = require("../../../models/Movies");
const { uploadMoviesQueue } = require("../../../services/bullServices");

exports.addTaskToMovieUploadQueue = async (data) => {
  try {
    console.log("data", data);
    const job = await uploadMoviesQueue.add(data);
    console.log(job);
    const response = await Movies.findByIdAndUpdate(
      data.movieId,
      {
        $push: {
          shortsJobs: job.id,
        },
      }
      // { new: true, upsert: true } //updated new columns
    );
    return {
      msg: "job added successfully ...shorts will upload soon",
      jobId: job.id,
    };
  } catch (error) {
    console.log("error", error);
    throw new Error(error);
  }
};
