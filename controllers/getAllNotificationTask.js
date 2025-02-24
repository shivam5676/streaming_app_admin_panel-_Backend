const NotificationTasks = require("../models/NotificationTask");

exports.getAllNotification = async (req, res, next) => {
  const { start, limit, searched } = req.query;
  let filter = {};

  try {
    if (searched && searched.trim() !== "") {
      filter = {
        $or: [
          { title: { $regex: searched, $options: "i" } },
          { jobId: { $regex: searched, $options: "i" } },
          { description: { $regex: searched, $options: "i" } },
          { status: { $regex: searched, $options: "i" } },
        ],
      };
    }
    const totalNotifications = await NotificationTasks.countDocuments(filter);
    const response = await NotificationTasks.find(filter)
      .skip(limit * start)
      .limit(limit);
    return res.status(200).json({
      notificationTasks: response,
      start,
      limit,
      totalData: totalNotifications,
      totalPages: Math.ceil(totalNotifications / limit),
    });
    console.log(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "something went wrong", err: error });
  }
};
