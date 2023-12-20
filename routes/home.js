// routes/userRoutes.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const username = req.session.username || 'Guest';
    console.log(req.session.id);


    res.render('home', { username });
  });

module.exports = router;
