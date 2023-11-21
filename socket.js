let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: [
          "http://localhost:3000",
          "http://localhost:3001",
          "https://economic-shop-client.onrender.com",
          "https://economic-shop-admin.onrender.com",
        ],
        methods: ["POST", "GET", "PUT", "OPTIONS", "HEAD", "DELETE"],
        credentials: true,
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
