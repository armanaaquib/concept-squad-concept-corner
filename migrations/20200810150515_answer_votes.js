exports.up = function (knex) {
  return knex.schema.createTable('answer_votes', function (table) {
    table
      .string('username')
      .references('username')
      .inTable('users')
      .notNull()
      .onDelete('cascade');
    table
      .integer('answer_id')
      .references('answer_id')
      .inTable('answers')
      .notNull()
      .onDelete('cascade');
    table.string('vote').notNull();
    table.primary(['username', 'answer_id', 'vote']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('answer_votes');
};
