
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('username').notNullable().defaultTo('');
    table.string('displayName').notNullable().defaultTo('');
    table.string('email').notNullable().defaultTo('');
    table.string('profile_url').defaultTo('/images/Spotify-icon.jpg');
    table.boolean('admin').notNullable().defaultTo('');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
