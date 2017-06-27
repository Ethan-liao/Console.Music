const methodOverride = require('method-override');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
// passport-spotify requirements
const session = require('express-session');
const passport = require('passport');
// const swig = require('swig');
const SpotifyStrategy = require('./spotify/index').Strategy;
// const SpotifyStrategy = require('passport-spotify');
const consolidate = require('consolidate');


const index = require('./routes/index');
// user was previously used for bcrypt login -- disabling for passport testing
// const user = require('./routes/user');
const credentials = require('./routes/client-credentials');
// const authRoute = require('./routes/auth');

const appKey = '893c3223efb24f6098017c1a11cfecd0';
const appSecret = '10c5354ab52548ef80f37c5612eb0c5f';


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Use the SpotifyStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and spotify
//   profile), and invoke a callback with a user object.
passport.use(new SpotifyStrategy({
  clientID: appKey,
  clientSecret: appSecret,
  callbackURL: 'http://localhost:8000/auth/spotify/callback' //  for dev https://ishamd-music-library.herokuapp.com/library
},
  (accessToken, refreshToken, profile, done) => {
    // asynchronous verification, for effect...
    console.log('SpotifyStrategy being hit');
    // User.findOrCreate({ spotifyId: profile.id }, (err, user) => done(err, user));
    process.nextTick(() =>
      // To keep the example simple, the user's spotify profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the spotify account with a user record in your database,
      // and return that user instead.
    done(null, profile));
  }));

const port = process.env.PORT || 8000;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.disable('x-powered-by');
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use(index);
// app.use(user);
app.use(credentials);
// app.use(authRoute);

app.use(cookieSession({
  name: 'music_library',
  // use environment variables to store secure information
  keys: [process.env.KEY_ONE, process.env.KEY_TWO, process.env.KEY_THREE]
}));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  if (app.get('env') !== 'test') {
    console.log('Listening on port', port);
  }
});

module.exports = app;
