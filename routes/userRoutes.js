// routes/userRoutes.js
const express = require('express');
const router = express.Router();

router.post('/set-username', (req, res) => {
  const { username } = req.body;
  req.session.username = username || 'Guest';
  res.redirect('/lobby');
});

module.exports = router;
