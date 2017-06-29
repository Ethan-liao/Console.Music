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
    res.redirect('/');
  }
});

router.get('/auth/spotify',
  passport.authenticate('spotify', { scope: ['user-read-email', 'user-read-private'], showDialog: true }, (err, user) => {
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
    let displayName = req.user.displayName;
    console.log('callback hit');

    if (displayName === null) {
      displayName = 'Spotify User';
    }

    knex('users')
      .where('username', req.user.username)
      .first()
      .returning('id')
      .then((exists) => {
        if (!exists) {
          knex('users')
            .insert({
              username: req.user.username,
              displayName,
              email: req.user._json.email,
              profile_url: req.user.photos[0],
              admin: 'False'
            })
            .returning('id')
            .then((id) => {
              req.session.userID = id;
              console.log('1: req.session.userID:', req.session.userID);
              console.log('1: redirect to /library');
              res.redirect('/library');
            });
        } else {
          // start a session with user credentials
          req.session.userID = exists.id;
          console.log('2: req.session.userID:', req.session.userID);
          console.log('2: redirect to /library');
          res.redirect('/library');
        }
      });
  });


// GET request for all books from our database
router.get('/library', (req, res, next) => {
  // check if user is authenticated
  console.log('library route being hit');
  console.log('3: req.session.userID:', req.session.userID);
  if (req.session.userID) {
    // render library page with posts from db
    console.log('/library -- session.userID exists');
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
    // go back to login
    console.log('/library -- session.userID does not exist - redirect to login');
    res.redirect('/');
  }
});


router.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

module.exports = router;
