const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    const { username } = req.session.username || 'Guest';
    console.log("x");

    res.render('home', { username });
  });
  
router.get('/:code', (req, res) => {
  const lobby = req.params.code;

  const username = req.session.username || 'Guest'; 
  req.session.code = lobby;
  console.log(req.session);


  if (!lobby) {
    // Handle invalid or non-existent lobby codes
    res.status(404).send('Lobby not found');
    return;
  }
  // Render the lobby page with the lobby data
  res.render('lobby', { lobby, username });
});


module.exports = router;
