const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/user', (req, res, next) => {
  // add knex insert for new user
  console.log('new user added');
  res.render('login');
});

module.exports = router;
