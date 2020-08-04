
exports.up = function(knex) {
  return knex.schema.createTable('questions', function(table) {
    table.increments('question_id')
      .primary();
    table.string('title')
      .notNullable();
    table.string('description');
    table.string('username')
      .references('username')
      .inTable('users')
      .notNull()
      .onDelete('cascade');
    table.integer('view_count');
    table.bool('is_answer_accepted');
    table.date('time'),
    table.integer('no_of_answers'),
    table.timestamps(false, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('questions');
};
