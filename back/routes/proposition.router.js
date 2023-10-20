const express = require("express");

const route = express.Router();

const auth = require("../middleware/auth");

const propositionController = require("../controllers/proposition.controller");

route.post("/postProposition", auth, propositionController.postProposition);
route.get(
  "/calculatePricePercentage",
  auth,
  propositionController.calculatePricePercentage
);
route.get(
  "/PercentageByMonth",
  auth,
  propositionController.calculateConfirmationPercentageByMonth
);
route.get(
  "/statusPercentage",
  auth,
  propositionController.calculateConfirmationStatusPercentage
);
route.post(
  "/updatePrice",
  propositionController.updatePropositionAndOfferPrice
);
module.exports = route;
