//vente.router
const express=require("express");

const route = express.Router()

const auth = require("../middleware/auth")
const venteController = require('../controllers/vente.controller.js');

// Define routes

route.post("/createInvoice", auth, venteController.createInvoice)
route.get("/displayinvoice/:propid", auth, venteController.displayinvoice)
route.get("/getInvoiceBeforeCreation", auth, venteController.createInvoice)

module.exports = route