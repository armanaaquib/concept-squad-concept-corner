exports.up = function(knex) {
  return knex.schema.createTable('questions', function(table) {
    table.increments('question_id').primary();
    table.string('title').notNullable();
    table.string('description');
    table
      .string('username')
      .references('username')
      .inTable('users')
      .notNull()
      .onDelete('cascade');
    table.integer('view_count').defaultTo(0);
    table.bool('is_answer_accepted').defaultTo(false);
    table.date('time').defaultTo(knex.fn.now());
    table.integer('no_of_answers').defaultTo(0);
  });
};
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('questions');
};
