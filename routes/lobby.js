const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    const { username } = req.session;
    console.log("x");
    res.render('lobby', { username });
  });
  
router.get('/:code', (req, res) => {
  const lobby = req.params.code;
  console.log(lobby);
  console.log("lobby/code stage");
  const username = req.session.username || 'Guest'; 
   

  if (!lobby) {
    // Handle invalid or non-existent lobby codes
    res.status(404).send('Lobby not found');
    return;
  }
  // Render the lobby page with the lobby data
  res.render('lobby', { lobby, username });
});


module.exports = router;
