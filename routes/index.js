const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log('root');
  res.render('login');
});

router.get('/track', (req, res, next) => {
  res.render('add_track');
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.get('/auth/spotify',
  passport.authenticate('spotify', { scope: ['user-read-email', 'user-read-private'] }, (err, user) => {
    console.log('more garbage');
    console.log(user);
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

    console.log(req.user.username);
    console.log(req.user._json.email);
    console.log(req.user.profileUrl);
    res.redirect('/library');
  });

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed. Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

module.exports = router;
