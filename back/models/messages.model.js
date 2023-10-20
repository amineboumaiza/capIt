const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Types.ObjectId, ref: "users" },
  receiver: { type: mongoose.Types.ObjectId, ref: "users" },
  content: { type: String },
  sentAt: { type: Date },
  read: { type: Boolean, default: false },
});

module.exports = mongoose.model("messages", messageSchema);
