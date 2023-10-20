// models/invoice.js
const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  fiscalPosition: { type: String },
  invoiceNumber: { type: Number, required: true },
  Seller_id: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    require: true,
  },
  offer_id: {
    type: mongoose.Types.ObjectId,
    ref: "offers",
    require: true,
  },
  proposition_id: {
    type: mongoose.Types.ObjectId,
    ref: "propositions",
    require: true,
  },
  sellerName: { type: String, required: true },
  customerName: { type: String, required: true },
  projectTitle: { type: String },
  projectDiscription: { type: String },
  billingAddress: { type: String },
  paymentCondition: { type: String },
  prix: { type: Number },
  taxRate: { type: Number, required: true },
  stampPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  creationDate: { type: Date, default: () => Date.now() },
  content: Buffer,
});
module.exports = mongoose.model("Invoices", invoiceSchema);
