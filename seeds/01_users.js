const userList = require('../sample_data/users');

exports.seed = function (knex) {
  return knex('users')
    .del()
    .then(() => knex('users').insert(userList));
};
