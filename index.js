const express = require("express");
const cors = require("cors");
const socket = require("socket.io");
const app = express();
app.use(express.json());
app.use(cors());

/* On crée le serveur */
const server = app.listen(4000, () => {
  console.log("Server has started");
});

/* On initie io et on spécifie pour cors les url autorisées*/
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome " });
});

/* connection à socket.io */
io.on("connection", (socket) => {
  console.log(socket.id);

  /* Pour rejoindre une room */

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("user joined room" + data);
  });

  /* Pour envoyer et recevoir les messages */
  socket.on("send_message", (data) => {
    console.log("message" + data.content.author);
    socket.to(data.room).emit("receive-message", data.content);
  });

  /* lorsqu'un utilisateur se déconnecte d'une room */
  socket.on("disconnected", (data) => {
    console.log(data.username + " disconnected from " + data.room);
  });

  socket.on("disconnect", (socket) => {
    console.log("disconnect");
  });
});
