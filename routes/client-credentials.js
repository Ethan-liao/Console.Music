/**
 * This is an example of a basic node.js script that performs
 * the Client Credentials oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 */

const request = require('request'); // "Request" library
const express = require('express');
const router = express.Router();

const client_id = '893c3223efb24f6098017c1a11cfecd0'; // Your client id
const client_secret = '10c5354ab52548ef80f37c5612eb0c5f'; // Your secret

// your application requests authorization

const authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    Authorization: `Basic ${new Buffer(`${client_id}:${client_secret}`).toString('base64')}`
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

let trackID;

/* GET authorization token and make data request. */
router.get('/test', (req, res, next) => {
  trackID = req.body.track;
  console.log(trackID);

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      // use the access token to access the Spotify Web API
      const token = body.access_token;
      const options = {
        url: 'https://api.spotify.com/v1/tracks/11dFghVXANMlKmJXsNCbNl',
        headers: {
          Authorization: `Bearer ${token}`
        },
        json: true
      };
      request.get(options, (error, response, body) => {
        console.log(body);
        res.send(body);
      });
    }
  });
});

router.post('/test', (req, res, next) => {
  trackID = req.body.track;
  console.log(trackID);

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      // use the access token to access the Spotify Web API
      const token = body.access_token;
      const options = {
        url: `https://api.spotify.com/v1/tracks/${trackID}`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        json: true
      };
      request.get(options, (error, response, body) => {
        console.log(body);
        res.send(body);
      });
    }
  });
});

module.exports = router;
