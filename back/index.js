const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const startArchiveUpdater = require("./tasks/archiveUpdater");
const Proposition = require("./models/proposition.model");

// sockets section

const { io } = require("./socket");

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);
  console.log(` joined socket with id : ${id} `);

  socket.on("postuler", ({ offerId }) => {
    console.log(offerId);
    const Offer = require("./models/offre.model");

    const findOffer = async () => {
      const offer = await Offer.findById(offerId);
      const userId = offer.creator.toString();
      console.log("userId : " + userId);
      socket.to(userId).emit("newProposition", { offer });
    };

    findOffer();
  });

  socket.on("postulerConfirm", ({ userId, propId, offerId }) => {
    Proposition.find({
      offer_id: offerId,
      status: "refusé",
      _id: { $ne: new mongoose.Types.ObjectId(propId) },
    }).then((props) => {
      console.log("props");
      console.log(props);
      for (let prop of props)
        socket.to(prop.user_id.toString()).emit("postulerConfirmNotification");
    });

    socket.to(userId).emit("postulerConfirmNotification");
  });

  socket.on("newMsg", ({ newMsg }) => {
    console.log("newMsg");
    console.log(newMsg);
    const id1 = newMsg.receiver._id;
    socket.emit("newMessage", { newMsg });
    socket.to(id1).emit("newMessage", { newMsg });
  });
});

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

// ----------------------
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("hello world ");
});

const userRoutes = require("./routes/user.router");
app.use("/users", userRoutes);

const offreRoutes = require("./routes/offre.router");
app.use("/offres", offreRoutes);

const propositionRoutes = require("./routes/proposition.router");
app.use("/propositions", propositionRoutes);

const notificationRoutes = require("./routes/notification.router");
app.use("/notifications", notificationRoutes);

const messageRoutes = require("./routes/message.router");
app.use("/messages", messageRoutes);

const venteRouter = require("./routes/vente.router");
app.use("/Vente", venteRouter);

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("data base connected successfully .. ");
});

app.listen(process.env.PORT, () => {
  console.log(`app raining ${process.env.PORT}`);
});
startArchiveUpdater();
