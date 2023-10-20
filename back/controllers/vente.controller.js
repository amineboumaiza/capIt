//vente.controller
const mongoose = require("mongoose");
const Invoice = require("../models/vente.model.js");
const User = require("../models/user.model");
const Proposition = require("../models/proposition.model");
const ofrre = require("../models/offre.model");
const pdf = require("html-pdf");
const { pdfTemplate } = require("../utils/pdfUtils");

async function getAndIncrementInvoiceNumber(sellerName) {
  try {
    const lastInvoice = await Invoice.findOne(
      { sellerName },
      { invoiceNumber: 1 },
      { sort: { invoiceNumber: -1 } }
    );

    if (lastInvoice) {
      return lastInvoice.invoiceNumber + 1;
    } else {
      return 1;
    }
  } catch (error) {
    throw error;
  }
}

async function getOfferDetails(token, propId) {
  try {
    const userId = await User.findOne({ token: token }, "_id");
    const userPropositions = await Proposition.aggregate([
      {
        $match: {
          user_id: userId._id,
          _id: new mongoose.Types.ObjectId(propId),
        },
      },
      {
        $lookup: {
          from: "offres",
          localField: "offer_id",
          foreignField: "_id",
          as: "offer",
        },
      },
      {
        $match: {
          "offer.isActive": false, // Filter out only inactive offers
        },
      },
      {
        $project: {
          _id: 0,
          offer: 1, // Select the offer details
        },
      },
    ]);
    return userPropositions[0].offer;
  } catch (error) {
    throw error;
  }
}

const displayinvoice = async (req, res) => {
  try {
    const { customerName2, projectTitle2, projectDescription2, prix2 } =
      req.body;
    const token = req.headers.token;
    const propid = req.params.propid;
    console.log(propid, "oooh");

    const user2 = await User.findOne({ token: token }, "username adresseLocal");
    if (!user2) {
      throw new Error("User not found");
    }
    console.log("token");
    const userPropositions2 = await Proposition.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(propid),
        },
      },
      {
        $lookup: {
          from: "offres",
          localField: "offer_id",
          foreignField: "_id",
          as: "offer",
        },
      },
      {
        $match: {
          "offer.isActive": false, // Filter out only inactive offers
        },
      },
      {
        $project: {
          _id: 0,
          offer: 1, // Select the offer details
        },
      },
    ]);
    const offerDetails2 = userPropositions2[0].offer;
    if (!offerDetails2) {
      throw new Error("No offer details found");
    }
    const sellerName2 = user2.username;
    const creatorId2 = offerDetails2[0].creator;
    const customer2 = await User.findById(creatorId2);
    const billingAddress2 = user2.adresseLocal;

    const partialInvoiceData2 = {
      sellerName2: sellerName2,
      customerName2: customer2.username,
      projectTitle2: offerDetails2[0].titre,
      projectDescription2: offerDetails2[0].description, // Corrected field name
      billingAddress2: billingAddress2,
      prix2: offerDetails2[0].prix,
    };
    console.log(partialInvoiceData2);

    //res.status(200).json({ msg: "invoice displayed" });
    res.status(200).json({ partialInvoiceData2 });
    return partialInvoiceData2;
  } catch (error) {
    throw error;
  }
};

async function getInvoiceBeforeCreation(token, propId) {
  try {
    const user = await User.findOne({ token: token }, "username adresseLocal");
    if (!user) {
      throw new Error("User not found");
    }

    const offerDetails = await getOfferDetails(token, propId);
    if (!offerDetails) {
      throw new Error("No offer details found");
    }

    const sellerName = user.username;
    const billingAddress = user.adresseLocal;
    const invoiceNumber = await getAndIncrementInvoiceNumber(sellerName);
    const creatorId = offerDetails[0].creator;
    const customer = await User.findById(creatorId);

    const partialInvoiceData = {
      invoiceNumber: invoiceNumber,
      sellerName: sellerName,
      customerName: customer.username,
      projectTitle: offerDetails[0].titre,
      projectDiscription: offerDetails[0].description,
      billingAddress: billingAddress,
      prix: offerDetails[0].prix,
    };

    return partialInvoiceData;
  } catch (error) {
    throw error;
  }
}

const createInvoice = async (req, res) => {
  try {
    const { paymentCondition, taxRate, stampPrice, propId } = req.body;
    const token = req.headers.token;

    const partialInvoiceData = await getInvoiceBeforeCreation(token, propId);

    const stampPriceFloat = parseFloat(stampPrice);
    const totalAmount =
      partialInvoiceData.prix / 1 +
      (partialInvoiceData.prix * taxRate) / 100 +
      stampPriceFloat;

    const invoiceData = {
      ...partialInvoiceData,
      paymentCondition: paymentCondition,
      taxRate: taxRate,
      stampPrice: stampPriceFloat,
      totalAmount: totalAmount,
    };

    const newInvoice = new Invoice(invoiceData);
    const savedInvoice = await newInvoice.save();

    pdf
      .create(
        pdfTemplate({
          num: savedInvoice.invoiceNumber,
          nom: savedInvoice.customerName,
          vendeur: savedInvoice.sellerName,
          date: savedInvoice.creationDate,
          desc: savedInvoice.projectDiscription,
          price: savedInvoice.prix,
          tax: savedInvoice.taxRate,
          timbrePrice: savedInvoice.stampPrice,
          total: savedInvoice.totalAmount,
        })
      )
      .toBuffer(async (err, buffer) => {
        if (err) throw err;
        savedInvoice["content"] = buffer;
        await savedInvoice.save();
        res.setHeader("Content-Type", "application/pdf");
        return res.status(200).send(savedInvoice.content);
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  createInvoice,
  displayinvoice,
};
