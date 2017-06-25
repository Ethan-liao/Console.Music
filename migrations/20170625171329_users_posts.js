
exports.up = function (knex) {
  return knex.schema.createTable('users_posts', (table) => {
    table.integer('user_id').references('id').inTable('users').notNullable();
    table.integer('post_id').references('id').inTable('posts').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users_posts');
};
