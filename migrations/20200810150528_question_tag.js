exports.up = function(knex) {
  return knex.schema.createTable('question_tag', function(table) {
    table
      .integer('question_id')
      .references('question_id')
      .inTable('questions')
      .notNull()
      .onDelete('cascade');
    table
      .integer('tag_id')
      .references('tag_id')
      .inTable('tags')
      .notNull()
      .onDelete('cascade');
  });
};
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('question_tag');
};
