const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");

const notificationController = require("../controllers/notification.controller");

route.get("/", auth, notificationController.getAllNotificationsByUser);
route.get("/nb", auth, notificationController.getNotificationsCounter);
route.put("/update", auth, notificationController.UpdateNotifications);

module.exports = route;
