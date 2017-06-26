const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('login');
});

router.get('/track', (req, res, next) => {
  res.render('add_track');
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

module.exports = router;
