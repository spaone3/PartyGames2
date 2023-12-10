// socket-functions.js
const initSocketFunctions = (io) => {
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
  

        socket.on("chat message", (msg) => {
            console.log(msg);
            io.emit("chat message", msg); // Broadcast the message to all connected clients
        });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
  
      // Other socket event handlers...
    });
  };
  
  module.exports = { initSocketFunctions };
  