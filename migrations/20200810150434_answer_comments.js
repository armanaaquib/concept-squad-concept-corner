exports.up = function (knex) {
  return knex.schema.createTable('answer_comments', function (table) {
    table.increments('comment_id').primary();
    table
      .integer('answer_id')
      .references('answer_id')
      .inTable('answers')
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
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('answer_comments');
};
