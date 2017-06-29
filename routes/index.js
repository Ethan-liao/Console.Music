const express = require('express');
const router = express.Router();
const passport = require('passport');
const knex = require('../knex');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('login');
});

router.get('/track', (req, res, next) => {
  if (req.session.userID) {
    const user_id = req.session.userID;
    res.render('add_track', { id: user_id });
  } else {
    console.log('Not authorized to add track');
    res.redirect('/');
  }
});

router.get('/auth/spotify',
  passport.authenticate('spotify', { scope: ['user-read-email', 'user-read-private'] }, (err, user) => {
  }),
  (req, res) => {
   // The request will be redirected to spotify for authentication, so this
   // function will not be called.
  });

  // GET /auth/spotify/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request. If authentication fails, the user will be redirected back to the
  //   login page. Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
router.get('/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to library.
    // add user to db
    knex('users')
      .where('username', req.user.username)
      .first()
      .returning('id')
      .then((exists) => {
        if (!exists) {
          knex('users')
            .insert({
              username: req.user.username,
              email: req.user._json.email,
              image_url: req.user.profileUrl,
              admin: 'False'
            })
            .returning('id')
            .then((id) => {
              req.session.userID = id;
              console.log('user added!');
              console.log(req.session.userID);
              res.redirect('/library');
            });
        } else {
          // start a session with user credentials
          req.session.userID = exists.id;
          console.log('user exists in the db!');
          console.log('session user id:', req.session.userID);
          // console.log(req.session.passport);
          res.redirect('/library');
        }
      });
  });


// GET request for all books from our database
router.get('/library', (req, res, next) => {
  // check if user is authenticated
  console.log(req.session.userID);
  if (req.session.userID) {
    // render library page with posts from db
    knex('posts')
    .join('users_posts', 'posts.id', 'users_posts.post_id')
    .join('users', 'users_posts.user_id', 'users.id')
    .orderBy('post_id', 'desc')
    .then((posts) => {
      res.render('library', {
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


router.get('/logout', (req, res) => {
  req.session.userID = null;
  req.logout();
  res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed. Otherwise, the user will be redirected to the
//   login page.
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect('/login');
// }

module.exports = router;
