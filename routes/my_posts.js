const express = require('express');
const router = express.Router();
// const passport = require('passport');
const knex = require('../knex');

// GET request for all books from our database
router.get('/my_posts', (req, res, next) => {
  // check if user is authenticated
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

// GET request to populate book edit page using book id/info
router.get('/my_posts/:id/edit', (_req, res, next) => {
  const post_id = Number.parseInt(_req.params.id);

  if (_req.session.userID) {
    // render edit page with post data from db
    knex('posts')
    .where('id', post_id)
    .then((posts) => {
      res.render('edit_post', {
        posts
      });
    })
    .catch((err) => {
      next(err);
    });
  } else {
    // go back to my_posts and throw error
    console.log('Not authorized to view this page');
    res.redirect('/my_posts');
  }
});

// PATCH request to update book information
router.patch('/my_posts/:id/edit', (req, res, next) => {
  knex('posts')
    .where('id', req.params.id)
    .then((post) => {
      if (!post) {
        return next();
      }
      return knex('posts')
        .update({
          id: req.params.id,
          comment: req.body.comment })
        .where('id', req.params.id);
    })
    .then(() => {
      res.redirect('/my_posts');
    })
    .catch((err) => {
      next(err);
    });
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
