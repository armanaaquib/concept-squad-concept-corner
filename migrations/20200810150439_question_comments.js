exports.up = function (knex) {
  return knex.schema.createTable('question_comments', function (table) {
    table.increments('comment_id').primary();
    table
      .integer('question_id')
      .references('question_id')
      .inTable('questions')
      .notNull()
      .onDelete('cascade');
    table
      .string('username')
      .references('username')
      .inTable('users')
      .notNull()
      .onDelete('cascade');
    table.string('comment');
    table.date('time').defaultTo(knex.fn.now());
    table.date('last_modified');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('question_comments');
};
