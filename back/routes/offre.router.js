const express = require("express");

const route = express.Router();

const auth = require("../middleware/auth");

const offreController = require("../controllers/offre.controller");

route.post("/postOffer", auth, offreController.postOffer);
route.get("/get3Offers", offreController.get3Offers);
route.get("/getAllOffers", offreController.getAllOffers);
route.get("/getOffersProposed", auth, offreController.getOffersProposed);
route.get("/getDashOffers", auth, offreController.getDashOffers);
route.post("/postConfirmation", auth, offreController.postConfirmation);
route.post("/postqualification", auth, offreController.postqualification);
route.post("/deleteOffer", auth, offreController.deleteOffer);
route.post("/editOffer", auth, offreController.editOffer);
route.post("/getOffer", auth, offreController.getOffer);
route.get("/getMyOffers", auth, offreController.getMyOffers);
route.get("/nombreoffers", auth, offreController.calculateNumberOfOffers);
module.exports = route;
