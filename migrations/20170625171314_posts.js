
exports.up = function (knex) {
  return knex.schema.createTable('posts', (table) => {
    table.increments('id');
    table.string('type').notNullable().defaultTo('');
    table.string('title').notNullable().defaultTo('');
    table.string('artist').notNullable().defaultTo('');
    table.string('language').notNullable().defaultTo('');
    table.text('comment').notNullable().defaultTo('');
    table.text('image_url').notNullable().defaultTo('');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('posts');
};
