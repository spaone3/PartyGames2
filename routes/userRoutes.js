// routes/userRoutes.js
const express = require('express');
const router = express.Router();

let ioInstance; // to store the io instance

function init(io) {
  ioInstance = io;
}

/*
function emitSocketEvent(name) {
  // Check if ioInstance is defined
  if (ioInstance) {
    // Use ioInstance to emit the socket event
    ioInstance.emit('update username', { name });
  }*/


router.post('/set-username', (req, res) => {
  const { username } = req.body;
  const lobby = req.session.code;
  console.log(req.session.code);
  req.session.username = username || 'Guest';

  //emitSocketEvent(username);
  res.redirect(`/lobby/${lobby}`);
});

module.exports = router;
