const Message = require("../models/messages.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

exports.getAllMessagesByUser = async (req, res) => {
  try {
    const user = new mongoose.Types.ObjectId(req.user.id);

    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: user }, { receiver: user }],
        },
      },
      {
        $sort: {
          sentAt: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    return res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    return res.status(400).json("error check logs.");
  }
};

exports.getAllMessagesByUserAndReceiver = async (req, res) => {
  try {
    let page = req.query["page"];
    if (!page) page = 0;
    const skip = page * 20;
    const user = new mongoose.Types.ObjectId(req.user.id);
    const receiver = await User.findOne({
      entrepriseName: req.params["entrepriseName"],
    });
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: user, receiver: receiver._id },
            { receiver: user, sender: receiver._id },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "receiver",
          foreignField: "_id",
          as: "receiver",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $sort: {
          sentAt: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: 20,
      },
      {
        $project: {
          sender: {
            _id: 1,
            entrepriseName: 1,
          },
          receiver: {
            _id: 1,
            entrepriseName: 1,
          },
          content: 1,
          sentAt: 1,
          read: 1,
        },
      },
      {
        $unwind: "$receiver",
      },
      {
        $unwind: "$sender",
      },
    ]);
    return res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    res.status(400).json("error check logs.");
  }
};

exports.SendMessage = async (req, res) => {
  try {
    const { entrepriseName, content } = req.body;
    const sender = await User.findOne({ _id: req.user.id });
    const receiver = await User.findOne({
      entrepriseName,
    });
    const sentAt = new Date(Date.now());
    const msg = new Message({
      sender: sender._id,
      receiver: receiver._id,
      content,
      sentAt,
    });
    const newMsg = await msg.save();
    let response = { ...newMsg["_doc"] };
    response.receiver = {
      _id: newMsg.receiver,
      entrepriseName: receiver.entrepriseName,
    };
    response.sender = {
      _id: newMsg.sender,
      entrepriseName: sender.entrepriseName,
    };
    return res.status(200).json({
      newMsg: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json("error");
  }
};

exports.getAllCompaniesByUserMessages = async (req, res) => {
  const token = req.headers.token;
  try {
    const user = await User.findOne({ token: token });
    const companiesSender = await Message.aggregate([
      {
        $match: {
          sender: user._id,
        },
      },
      {
        $group: {
          _id: "$receiver",
          sent: { $max: "$sentAt" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "_id",
        },
      },
      {
        $unwind: "$_id",
      },
      {
        $project: {
          "_id.entrepriseName": 1,
          "_id.picture": 1,
          sent: 1,
          unreadCount: 1,
        },
      },
    ]);

    const companiesReceiver = await Message.aggregate([
      {
        $match: {
          receiver: user._id,
        },
      },
      {
        $group: {
          _id: "$sender",
          sent: { $max: "$sentAt" },
          unreadCount: { $sum: { $cond: [{ $eq: ["$read", false] }, 1, 0] } },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "_id",
        },
      },
      {
        $unwind: "$_id",
      },
      {
        $project: {
          "_id.entrepriseName": 1,
          "_id.picture": 1,
          sent: 1,
          unreadCount: 1,
        },
      },
    ]);

    const hashMap = {};
    for (company of companiesSender) {
      const entrepriseName = company._id.entrepriseName;
      hashMap[entrepriseName] = company["_id"];
      hashMap[entrepriseName]["sentAt"] = company["sent"];
      hashMap[entrepriseName]["unreadCount"] = 0;
    }
    for (company of companiesReceiver) {
      const entrepriseName = company._id.entrepriseName;
      hashMap[entrepriseName] = company["_id"];
      hashMap[entrepriseName]["sentAt"] = company["sent"];
      hashMap[entrepriseName]["unreadCount"] = company["unreadCount"];
    }

    hashMap[user.entrepriseName] = {
      picture: user.picture,
      entrepriseName: user.entrepriseName,
    };

    return res.status(200).json(Object.values(hashMap));
  } catch (error) {
    console.log(error);
  }
};

exports.updateReadMessages = async (req, res) => {
  try {
    const token = req.headers.token;

    const user = await User.findOne({ token: token });

    const entrepriseName = req.params["entrepriseName"];
    const entreprise = await User.findOne(
      {
        entrepriseName: entrepriseName,
      },
      "_id"
    );
    const result = await Message.updateMany(
      { receiver: user._id, read: false, sender: entreprise._id },
      { $set: { read: true } }
    );

    return res.status(200).json("updated successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).json("error read logs.");
  }
};
