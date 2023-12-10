const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    const { username } = req.session;
    res.render('lobby', { username });
  });
  

module.exports = router;
