const Offre = require("../models/offre.model");
const User = require("../models/user.model");
const Proposition = require("../models/proposition.model");
const Notification = require("../models/notifications.model");
const jwt = require("jsonwebtoken");

exports.postProposition = async (req, res) => {
  const token = req.headers.token;
  try {
    const user_id = await User.findOne({ token: token }, "_id");

    const {
      description,
      dateFinale,
      competence,
      email,
      prix,
      phoneNumber,
      offer_id,
    } = req.body;
    const prop = await Proposition.find({
      user_id: user_id,
      offer_id: offer_id,
    });
    const offre = await Offre.find({ _id: offer_id });
    const creator = offre[0].creator;
    console.log("creator");
    console.log(creator);
    if (prop.length == 0) {
      const offer = await Offre.findOne({ _id: offer_id, creator: user_id });
      console.log("Offer:", offer);
      if (offer) {
        res.status(400).json({
          msg: "You cannot propose to your own offer",
          offerCreator: offer.creator,
        });
      } else {
        const newProposition = Proposition({
          description,
          email,
          phoneNumber,
          prix,
          dateFinale,
          competence,
          user_id,
          offer_id,
        });
        console.log(newProposition);
        newProposition.save().then(() => {
          const newNotif = Notification({
            offer: offer_id,
            user: creator,
            createdAt: new Date(Date.now()),
            notificationType: "proposition",
          });
          newNotif.save().then(() => {
            res.status(200).json({ msg: "Proposition Sent" });
          });
        });
      }
    } else {
      res.status(400).json({ msg: "You already Proposed to this offer" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Problem while adding proposition" });
  }
};

exports.calculatePricePercentage = async (req, res) => {
  const token = req.headers.token;
  try {
    const user = await User.findOne({ token: token }, "_id");

    const confirmedPropositions = await Proposition.find({
      user_id: user._id,
      status: "confirmé",
    }).exec();

    const totalConfirmedPrice = confirmedPropositions.reduce(
      (total, proposition) => {
        return total + parseFloat(proposition.prix);
      },
      0
    );

    console.log(confirmedPropositions);

    const PayedPropositions = confirmedPropositions.filter((proposition) => {
      return proposition.dateFinale < Date.now();
    });

    const PayedPrice = PayedPropositions.reduce((total, proposition) => {
      return total + parseFloat(proposition.prix);
    }, 0);

    let percentage = 0;
    if (totalConfirmedPrice > 0) {
      percentage = (PayedPrice / totalConfirmedPrice) * 100;
    }

    res.status(200).json({ percentage, PayedPrice });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "Error" });
  }
};
exports.calculateConfirmationPercentageByMonth = async (req, res) => {
  const token = req.headers.token;
  const { month, year } = req.params;
  console.log(req.params);
  console.log(`month : ${month}`);
  console.log(`year : ${year}`);

  try {
    const user = await User.findOne({ token: token }, "_id");

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const allPropositions = await Proposition.find({
      user_id: user._id,
      dateFinale: { $gte: startDate, $lte: endDate },
    }).exec();
    const confirmedPropositions = allPropositions.filter(
      (proposition) => proposition.status === "confirmé"
    );

    const confirmationPercentage =
      (confirmedPropositions.length / allPropositions.length) * 100;

    res.status(200).json({ percentage: confirmationPercentage });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "Error" });
  }
};
exports.calculateConfirmationStatusPercentage = async (req, res) => {
  const token = req.headers.token;

  try {
    const user = await User.findOne({ token: token }, "_id");

    const allPropositions = await Proposition.find({
      user_id: user._id,
    }).exec();
    const totalPropositions = allPropositions.length;

    const statusCounts = {
      confirmé: 0,
      encours: 0,
      refusé: 0,
      qualifé: 0,
    };

    allPropositions.forEach((proposition) => {
      if (proposition.status === "confirmé") {
        statusCounts.confirmé++;
      } else if (proposition.status === "encours") {
        statusCounts.encours++;
      } else if (proposition.status === "refusé") {
        statusCounts.refusé++;
      } else if (proposition.status === "Qualifié") {
        statusCounts.qualifé++;
      }
    });

    const confirmationPercentage =
      (statusCounts.confirmé / totalPropositions) * 100;
    const encoursPercentage = (statusCounts.encours / totalPropositions) * 100;
    const refuséPercentage = (statusCounts.refusé / totalPropositions) * 100;
    const qualifiéPercentage = (statusCounts.qualifé / totalPropositions) * 100;

    res.status(200).json({
      confirmationPercentage,
      encoursPercentage,
      refuséPercentage,
      qualifiéPercentage,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "Error" });
  }
};
exports.updatePropositionAndOfferPrice = async (req, res) => {
  const { propositionId, newPrice } = req.body;

  try {
    const updatedProposition = await Proposition.findByIdAndUpdate(
      propositionId,
      { prix: newPrice },
      { new: true }
    ).exec();

    if (!updatedProposition) {
      return res.status(404).json({ msg: "Proposition not found" });
    }
    const updatedOffer = await Offre.findByIdAndUpdate(
      updatedProposition.offer_id,
      { prix: newPrice },
      { new: true }
    ).exec();
    if (!updatedOffer) {
      return res.status(404).json({ msg: "Offer not found" });
    }
    res.status(200).json({ msg: "Prices updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "Error" });
  }
};
