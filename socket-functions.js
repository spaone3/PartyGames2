// socket-functions.js

const lobbies = {};



const initSocketFunctions = (io) => {
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
  

        socket.on("chat message", (data) => {
            console.log(data);
            io.emit("chat message", data); // Broadcast the message to all connected clients
        });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
  
      // Other socket event handlers...
    });
  };
  
  module.exports = { initSocketFunctions };
  