const cron = require("node-cron");
const Propositions = require("../models/proposition.model");
const Offre = require("../models/offre.model");

const startArchiveUpdater = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const propositionsToUpdate = await Propositions.find({
        status: { $ne: "encours" },
        "offer_id.isActive": true,
        createdAt: { $lte: oneDayAgo },
      });
      const offreIds = propositionsToUpdate.map(
        (propositions) => propositions.offer_id._id
      );
      await Offre.updateMany({ _id: { $in: offreIds } }, { isActive: false });
      console.log("is Active");
    } catch (err) {
      console.log("error update : ", err);
    }
  });
};
module.exports= startArchiveUpdater;