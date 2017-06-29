
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('username').notNullable().defaultTo('');
    table.string('displayName').defaultTo('Spotify User');
    table.string('email').notNullable().defaultTo('');
    table.string('profile_url').defaultTo('https://vignette4.wikia.nocookie.net/nocopyrightsounds/images/f/fe/Spotify-icon.jpg/revision/latest/scale-to-width-down/480?cb=20151216175322');
    table.boolean('admin').notNullable().defaultTo('');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
