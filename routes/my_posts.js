const express = require('express');
const router = express.Router();
// const passport = require('passport');
const knex = require('../knex');

// GET request for all books from our database
router.get('/my_posts', (req, res, next) => {
  // check if user is authenticated
  console.log(req.session.userID);
  if (req.session.userID) {
    // render library page with posts from db
    const id = req.session.userID;
    knex('users_posts')
    .where('user_id', id)
    .join('posts', 'users_posts.post_id', 'posts.id')
    .then((posts) => {
      res.render('my_posts', {
        posts
      });
    })
    .catch((err) => {
      next(err);
    });
  } else {
    // go back to login and throw error
    console.log('Not authorized to view this page');
    res.redirect('/');
  }
});

module.exports = router;
