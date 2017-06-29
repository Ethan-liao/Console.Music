/**
 * This is a basic node.js script that performs
 * the Client Credentials oAuth2 flow to authenticate against
 * the Spotify Accounts.
 */

const request = require('request');
const express = require('express');
const knex = require('../knex');

const router = express.Router();

const client_id = process.env.clientID; // Provided by spotfiy
const client_secret = process.env.clientSecret; // Provided by spotfiy

// Info needed to request authorization from spotify
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

/* Gets the authorization token and makes data request based off form input. */
router.post('/track', (req, res, next) => {
  const trackURI = req.body.track;
  const newLanguage = req.body.language;
  const newComment = req.body.comment;
  const user = req.body.user_id;
  const trackID = trackURI.substr(14);

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
        knex('posts')
          .returning('id')
          .insert({
            type: body.type,
            title: body.name,
            artist: body.artists[0].name,
            language: newLanguage,
            comment: newComment,
            image_url: body.album.images[0].url,
            track_url: body.external_urls.spotify,
            preview_url: body.preview_url
          })
          .then(id => knex('users_posts')
          .insert({
            user_id: parseInt(user),
            post_id: parseInt(id)
          }))
          .then(() => {
            res.redirect('/library');
          });
      });
    }
  });
});

module.exports = router;
