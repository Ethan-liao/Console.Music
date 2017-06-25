
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('username').notNullable().defaultTo('');
    table.string('hashed_password').notNullable().defaultTo('');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
