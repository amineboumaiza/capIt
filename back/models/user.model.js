const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, default: "" },
  email: { type: String, Unique: true },
  password: String,
  phoneNumber: String,
  picture: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  entrepriseName: {
    type: String,
    default: "",
  },
  postEntreprise: { type: String, default: "" },
  adresseLocal: {
    type: String,
    default: "",
  },
  numEmployees: {
    type: String,
    enum: ["petite", "moyenne", "grande"],
    default: "petite",
  },
  secActivity: {
    type: String,
    enum: [
      "Graphisme & Design",
      "Programmation & Tech",
      "Rédaction & Traduction",
      "Photographie",
      "Vidéo & Animation",
      "Loisirs",
      "Data",
      "Sponsoring",
      "Musique & audio",
    ],
  },
  activity: { type: String, default: "" },
  website: { type: String, default: "" },
  entrepriseStatus: { type: String, default: "" },
  capitalSocial: { type: String, default: "" },
  bio: { type: String, default: "" },
  dateCreation: { type: Date, default: Date.now() },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  token: String,
});
module.exports = mongoose.model("users", userSchema);
