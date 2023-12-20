const express = require('express');
const router = express.Router();
const socketFunctions = require('../socket-functions');


router.get('/', (req, res) => {
    const { username } = req.session.username || 'Guest';
    console.log("x");

    res.render('home', { username });
  });
  

router.get('/:code', (req, res) => {
  const lobby = req.params.code;

  const username = req.session.username || 'Guest'; 
  req.session.code = lobby;

  players = socketFunctions.lobbies[lobby];
  chat = socketFunctions.chat[lobby];
  host = socketFunctions.host[lobby];

  if (!lobby) {
    // Handle invalid or non-existent lobby codes
    res.status(404).send('Lobby not found');
    return;
  }
  // Render the lobby page with the lobby data
  res.render('lobby', { lobby, username, players, chat, host });
});

router.get('/:code/:game', (req, res) => {
  console.log('GAME ROUTER');
  lobby = req.params.code;
  game = req.params.game;


  players = socketFunctions.lobbies[lobby];
  chat = socketFunctions.chat[lobby];
  host = socketFunctions.host[lobby];


  console.log('\n',players,'\n');


  username = req.session.username || 'Guest';
  res.render(game, {lobby, username, players, chat, host});
});
module.exports = router;
