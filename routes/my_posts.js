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

// DELETE request to remove a book and its reference in join table
router.delete('/my_posts/:id', (req, res, next) => {
  const post_id = req.params.id;

  knex('users_posts')
  .del()
  .where('post_id', post_id)

    .then(() => knex('posts')
    .where('id', post_id)
    .first()

      .then((row) => {
        if (!row) {
          return next();
        }
        return knex('posts')
          .del()
          .where('id', post_id);
      })
    )
    .then(() => {
      res.redirect('/my_posts');
    })
  .catch((err) => {
    next(err);
  });
});

module.exports = router;
