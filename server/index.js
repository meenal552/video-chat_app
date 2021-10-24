const express = require("express");
const app = express();
const socket = require("socket.io");
const server = require("http").Server(app);
const cors = require("cors");
const { SSL_OP_NO_TICKET } = require("constants");
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.get("/", (req, res) => {
  res.send("hello world ");
});
const port = 4000;
server.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

const io = socket(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  },
});
const peerdata = {};
const peers = [];
const peernames = {};

io.on("connection", (socket) => {
  console.log(socket.id, "Made new connection");

  const roomId = socket.handshake.query.roomId;
  let userName = socket.handshake.query.userName;

  console.log(`Room ID retrieved from ${socket.id}: ${roomId} `);

  socket.join(roomId);
  peerdata[socket.id] = {
    userName,
  };

  // socket.on("add-to-room", (id) => {
  //   peerdata[socket.id] = {
  //     peerid: id,
  //   };
  //   peers.push(id);

  //   console.log("add to room ", peerdata[socket.id].peerid);
  // });
  socket.on("join-room", (id) => {
    const data = {
      id: id,
      username: peerdata[socket.id].userName,
    };
    peers.push(id);
    peerdata[socket.id].peerid = id;
    peernames[id] = peerdata[socket.id].userName;
    console.log(
      "join room username " +
        peerdata[socket.id].userName +
        peerdata[socket.id].peerid
    );
    io.in(roomId).emit("user-connected", data);
    console.log("new user connected join room ");
  });
  socket.on("call", (userId) => {
    io.in(roomId).emit("call", userId);
  });

  socket.on("user-disconnected", (userId) => {
    console.log("user disconnected ", userId);
    io.in(roomId).emit("user-disconnected", userId);
  });
  socket.on("togglestream", (peerid) => {
    io.in(roomId).emit("togglestream", peerid);
  });
  socket.on("mute-unmute", (data) => {
    io.in(roomId).emit("mute-unmute", data);
  });
  socket.on("disconnect", () => {
    if (peerdata[socket.id]) {
      io.in(roomId).emit("user-disconnected", peerdata[socket.id].peerid);
      console.log("disconnect explicitely ", peerdata[socket.id].peerid);
      const i = peers.indexOf(peerdata[socket.id].peerid);
      if (i > -1) {
        peers.splice(i, 1);
      }
    }
  });
  socket.on("messageSend", (data) => {
    console.log("newmessage emitted");
    io.in(roomId).emit("newMessage", {
      ...data,
      user: peerdata[socket.id].userName,
    });
  });

  /// common room
  socket.on("play-video", (peerid) => {
    data = {
      peerid: peerid,
      peers: peers,
    };
    io.in(roomId).emit("play-video", data);
  });
  socket.on("getUsername", (id) => {
    io.in(roomId).emit("getUsername", peernames[id]);
    console.log("getusername called by ", peernames[id]);
  });
  socket.on("getPeers", () => {
    io.in(roomId).emit("getPeers", peers);
  });
});
