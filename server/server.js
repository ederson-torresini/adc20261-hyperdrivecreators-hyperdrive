const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: [/localhost/, /github\.dev/, /feira-de-jogos\.dev\.br/],
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on("scene0", (room, state) => {
    socket.to(room).emit("scene0", { ...state });
  });

  socket.on("start-game", (room, player, asteroids) => {
    console.log(`Sala ${room} iniciada com jogador:`, player);
    if (room) socket.to(room).emit("game-started", { player, asteroids });
  });

  socket.on("collision-event", (room, data) => {
    console.log(`Collision detected in room ${room} by player:`, data.playerId);
    socket.to(room).emit("collision-event", data);
  });

  socket.on("game-over", (room, data) => {
    console.log(`Game over in room ${room} for player:`, data.playerId);
    socket.to(room).emit("game-over", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(3000);
