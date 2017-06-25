const usersPostsList = require('../sample_data/users_posts');

exports.seed = function (knex) {
  return knex('users_posts')
    .del()
    .then(() => knex('users_posts').insert(usersPostsList));
};
