// routes/userRoutes.js
const express = require('express');
const router = express.Router();



router.post('/set-username', (req, res) => {
  const { username } = req.body;
  const lobby = req.session.code;
  console.log(req.session.code);
  req.session.username = username || 'Guest';

  res.redirect(`/lobby/${lobby}`);
});

module.exports = router;
