const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");

const messagesController = require("../controllers/message.controller");

route.get("/", auth, messagesController.getAllMessagesByUser);
route.post("/newMsg", auth, messagesController.SendMessage);
route.get(
  "/t/:entrepriseName",
  auth,
  messagesController.getAllMessagesByUserAndReceiver
);

route.get(
  "/all-messaged-companies",
  auth,
  messagesController.getAllCompaniesByUserMessages
);
route.get(
  "/updateRead/:entrepriseName",
  auth,
  messagesController.updateReadMessages
);
module.exports = route;
