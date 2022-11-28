require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./MiddleWare/errorMiddlerWare");
const colors = require("colors");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");

const { chats } = require("./data/data");

const app = express();

app.use(express.json()); // to accept json data

connectDB();

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", ["*","/api/*"]);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`running on port ${PORT}.`.yellow));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://golden-parfait-263ee6.netlify.app",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", (userData) => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
