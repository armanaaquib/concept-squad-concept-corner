exports.up = function (knex) {
  return knex.schema.createTable('preferred_tags', function (table) {
    table
      .string('username')
      .references('username')
      .inTable('users')
      .notNull()
      .onDelete('cascade');
    table
      .integer('tag_id')
      .references('tag_id')
      .inTable('tags')
      .notNull()
      .onDelete('cascade');
    table.primary(['username', 'tag_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('preferred_tags');
};
