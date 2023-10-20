const Notification = require("../models/notifications.model");
const mongoose = require("mongoose");

exports.getAllNotificationsByUser = async (req, res) => {
  try {
    const user = new mongoose.Types.ObjectId(req.user.id);
    const notifications = await Notification.aggregate([
      {
        $match: {
          user,
        },
      },
      {
        $lookup: {
          from: "offres",
          localField: "offer",
          foreignField: "_id",
          as: "offer",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 10,
      },
      {
        $unwind: "$offer",
      },
      {
        $project: {
          isRead: 1,
          user: 1,
          createdAt: 1,
          notificationType: 1,
          offer: { _id: 1, titre: 1 },
        },
      },
    ]);
    res.status(200).json({ notifications });
  } catch (error) {
    console.log(error);
    res.status(400).json("error getting notifications");
  }
};

exports.UpdateNotifications = async (req, res) => {
  const data = req.body;
  const notifIds = data["notifs"];
  console.log("data");
  console.log(data);
  await Notification.updateMany(
    { _id: { $in: notifIds } },
    { $set: { isRead: true } }
  );
  res.status(200).json("notifications updated successfully");
};

exports.getNotificationsCounter = async (req, res) => {
  try {
    const user = new mongoose.Types.ObjectId(req.user.id);
    const nb = await Notification.countDocuments({ isRead: false, user });
    return res.status(200).json({ notificationsNumber: nb });
  } catch (error) {
    console.log(error);
    return res.status(400).json("error");
  }
};
