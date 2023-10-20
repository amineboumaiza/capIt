const mongoose = require("mongoose");

const typeEnum = ["proposition", "reponseProposition"];

const notificationSchema = new mongoose.Schema({
  isRead: { type: Boolean, default: false },
  offer: { type: mongoose.Types.ObjectId, ref: "offres" },
  user: { type: mongoose.Types.ObjectId, ref: "users" },
  createdAt: { type: Date },
  notificationType: { type: String, enum: typeEnum },
});

module.exports = mongoose.model("notifications", notificationSchema);
