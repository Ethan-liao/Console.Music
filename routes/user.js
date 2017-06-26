const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const knex = require('../knex');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});


router.post('/user', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || username.trim() === '') {
    const err = new Error('Username must not be blank');
    err.status = 400;

    return next(err);
  }

  if (!password || password.trim() === '') {
    const err = new Error('Password must not be blank');
    err.status = 400;

    return next(err);
  }

  knex('users')
    .select(knex.raw('1=1'))
    .where('username', username)
    .first()
    .then((exists) => {
      if (exists) {
        const err = new Error('Username already exists');
        err.status = 400;

        throw err;
      }

      return bcrypt.hash(password, 12);
    })
    .then(hashed_password => knex('users').insert({ username, hashed_password }))
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
