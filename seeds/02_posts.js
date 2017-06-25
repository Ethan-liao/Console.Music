const postsList = require('../sample_data/posts');

exports.seed = function (knex) {
  return knex('posts')
    .del()
    .then(() => knex('posts').insert(postsList));
};
