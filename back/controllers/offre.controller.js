const Offre = require("../models/offre.model");
const User = require("../models/user.model");
const Notification = require("../models/notifications.model");
const Proposition = require("../models/proposition.model");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

exports.postOffer = async (req, res) => {
  const token = req.headers.token;
  try {
    const creator = await User.findOne({ token: token }, "_id");

    const { titre, description, dateDebut, dateFin, technologie, prix } =
      req.body;

    const newOffer = Offre({
      creator,
      titre,
      description,
      dateDebut,
      dateFin,
      technologie,
      prix,
    });

    newOffer.save().then(() => {
      res.status(200).json({ msg: "Offer Posted" });
    });
  } catch {
    res.status(400).json({ msg: "Problem while adding offer" });
  }
};

exports.get3Offers = async (req, res) => {
  const offers = await Offre.aggregate([
    {
      $lookup: {
        from: "users",
        let: { creatorId: "$creator" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$creatorId"] },
            },
          },
          {
            $project: {
              _id: 0,
              picture: 1,
              username: 1,
              entrepriseName: 1,
            },
          },
        ],
        as: "user",
      },
    },
    {
      $sort: {
        dateCreation: -1,
      },
    },
    {
      $limit: 3,
    },
  ]);

  console.log(offers);

  res.status(200).json({ offers });
};

exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offre.aggregate([
      {
        $match: {
          isActive: true, // Filtre pour n'inclure que les offres avec isActive=true
        },
      },
      {
        $lookup: {
          from: "users",
          let: { creatorId: "$creator" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$creatorId"] },
              },
            },
            {
              $project: {
                _id: 0,
                picture: 1,
                username: 1,
                entrepriseName: 1,
              },
            },
          ],
          as: "user",
        },
      },
      {
        $sort: {
          dateCreation: -1,
        },
      },
    ]);

    res.status(200).json({ offers });
  } catch {
    res.status(400).json({ msg: "Error" });
  }
};

exports.getOffersProposed = async (req, res) => {
  const token = req.headers.token;

  try {
    const userId = await User.findOne({ token: token }, "_id");

    const userPropositions = await Proposition.aggregate([
      {
        $match: {
          user_id: userId._id,
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
        $lookup: {
          from: "users",
          localField: "offer.creator",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 1,
          description: 1,
          competence: 1,
          prix: 1,
          status: 1,
          dateFinale: 1,
          "offer._id": 1,
          "offer.titre": 1,
          "offer.technologie": 1,
          user_id: 1,
          "user.entrepriseName": 1,
          "user.picture": 1,
          "user.email": 1,
        },
      },
    ]);
    res.status(200).json({ userPropositions });
  } catch {
    res.status(400).json({ msg: "Error" });
  }
};

exports.getDashOffers = async (req, res) => {
  const token = req.headers.token;
  try {
    const userId = await User.findOne({ token: token }, "_id");
    const myOffersPropositions = await Offre.aggregate([
      {
        $match: {
          creator: userId._id,
        },
      },
      {
        $lookup: {
          from: "propositions",
          localField: "_id",
          foreignField: "offer_id",
          as: "proposition",
        },
      },
      {
        $unwind: "$proposition",
      },
      {
        $lookup: {
          from: "users",
          localField: "proposition.user_id",
          foreignField: "_id",
          as: "proposition.user",
        },
      },
      {
        $project: {
          _id: 1,
          titre: 1,
          creator: 1,
          "proposition._id": 1,
          "proposition.description": 1,
          "proposition.email": 1,
          "proposition.phoneNumber": 1,
          "proposition.prix": 1,
          "proposition.dateFinale": 1,
          "proposition.competence": 1,
          "proposition.user_id": 1,
          "proposition.user.entrepriseName": 1,
          "proposition.user.picture": 1,
          "proposition.status": 1,
        },
      },
    ]);

    res.status(200).json({ myOffersPropositions });
  } catch {
    res.status(400).json({ msg: "Error" });
  }
};

exports.postConfirmation = async (req, res) => {
  try {
    const propId = req.body.prop_id;
    const offerId = req.body.offer_id;
    const proposition = await Proposition.findOne({ _id: propId });

    const result = await Proposition.updateMany(
      { offer_id: offerId },
      { status: "refusé" }
    );
    const props = await Proposition.find({
      offer_id: offerId,
      status: "refusé",
      _id: { $ne: new mongoose.Types.ObjectId(propId) },
    });

    for (let prop of props) {
      const newNotification = Notification({
        offer: offerId,
        user: prop.user_id,
        createdAt: new Date(Date.now()),
        notificationType: "reponseProposition",
      });
      newNotification.save();
    }

    proposition.status = "confirmé";
    await proposition.save();

    // Mise à jour de l'attribut isActive de l'offre associée
    const offer = await Offre.findOne({ _id: offerId });
    if (offer) {
      offer.isActive = false;
      await offer.save();
    }

    // res.status(200).json({ msg: "Confirmed" });

    proposition.save().then(() => {
      const newNotification = Notification({
        offer: offerId,
        user: proposition.user_id,
        createdAt: new Date(Date.now()),
        notificationType: "reponseProposition",
      });
      newNotification
        .save()
        .then(() => res.status(200).json({ msg: "Confirmed" }));
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Error" });
  }
};

exports.postqualification = async (req, res) => {
  try {
    const _id = req.body.prop_id;
    const offer_id = req.body.offer_id;
    const proposition = await Proposition.findOne({ _id });

    // Update the status of the selected proposition to "Qualifié"
    proposition.status = "Qualifié";

    // Save the changes made to the selected proposition
    await proposition.save();

    // Send a response indicating success
    res.status(200).json({ msg: "Qualified" });
  } catch (err) {
    // Log any errors that occur during the process
    console.error(err);
    // Send a response indicating failure
    res.status(400).json({ msg: "Error" });
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    const _id = req.body._id;
    console.log(req.body);
    await Proposition.deleteMany({ offer_id: _id });
    await Offre.findByIdAndDelete({ _id: _id });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

exports.getMyOffers = async (req, res) => {
  const token = req.headers.token;
  try {
    const userId = await User.findOne({ token: token }, "_id");
    const myConfirmedPropositions = await Proposition.find({
      user_id: userId.id,
      status: "confirmé",
    }).exec();
    const confirmedOfferIds = myConfirmedPropositions.map(
      (Proposition) => Proposition.offer_id
    );

    const offers = await Offre.aggregate([
      {
        $match: {
          $or: [
            { creator: userId._id, isActive: false },
            { _id: { $in: confirmedOfferIds } },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          let: { creatorId: "$creator" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", { $toObjectId: "$$creatorId" }] },
              },
            },
            {
              $project: {
                _id: 0,
                picture: 1,
                username: 1,
                entrepriseName: 1,
              },
            },
          ],
          as: "user",
        },
      },
      {
        $sort: {
          dateCreation: -1,
        },
      },
    ]).exec();
    res.status(200).json({ offers });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "Error" });
  }
};

exports.editOffer = async (req, res) => {
  try {
    const id = req.body._id;
    const { titre, description, prix, dateDebut, dateFin, technologie } =
      req.body;
    console.log(req.body);
    const offer = await Offre.findById({ _id: id });
    offer.titre = titre;
    offer.description = description;
    offer.prix = prix;
    offer.dateDebut = dateDebut;
    offer.dateFin = dateFin;
    offer.technologie = technologie;
    console.log(offer);
    offer.save();
    res.status(200).json({ offer });
  } catch {
    res.status(400);
  }
};
exports.getOffer = async (req, res) => {
  try {
    const { id } = req.body;
    const offer = await Offre.findById({ _id: id });
    res.status(200).json({ offer });
  } catch {
    res.status(400);
  }
};
exports.getMyOffers = async (req, res) => {
  const token = req.headers.token;
  try {
    const userId = await User.findOne({ token: token }, "_id");
    const myConfirmedPropositions = await Proposition.find({
      user_id: userId.id,
      status: "confirmé",
    }).exec();
    const confirmedOfferIds = myConfirmedPropositions.map(
      (Proposition) => Proposition.offer_id
    );

    const offers = await Offre.aggregate([
      {
        $match: {
          $or: [
            { creator: userId._id, isActive: false },
            { _id: { $in: confirmedOfferIds } },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          let: { creatorId: "$creator" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", { $toObjectId: "$$creatorId" }] },
              },
            },
            {
              $project: {
                _id: 0,
                picture: 1,
                username: 1,
                entrepriseName: 1,
              },
            },
          ],
          as: "user",
        },
      },
      {
        $sort: {
          dateCreation: -1,
        },
      },
    ]).exec();
    res.status(200).json({ offers });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "Error" });
  }
};

exports.calculateNumberOfOffers = async (req, res) => {
  const token = req.headers.token;

  try {
    const user = await User.findOne({ token: token }, "_id");

    const numberOfOffers = await Offre.countDocuments({
      creator: user._id,
    }).exec();

    res.status(200).json({ numberOfOffers });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "Error" });
  }
};
