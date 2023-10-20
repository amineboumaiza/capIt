const io = require("socket.io")({
  cors: {
    origin: ["http://localhost:3000"],
  },
});

const { instrument } = require("@socket.io/admin-ui");

const socket = io.listen(5000);

instrument(io, { auth: false });

module.exports = { io, socket };
