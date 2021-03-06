exports.up = function (knex) {
  return knex.schema.createTable('answers', function (table) {
    table.increments('answer_id').primary();
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
    table.string('answer');
    table.bool('accepted').defaultTo(false);
    table.date('time').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('answers');
};
