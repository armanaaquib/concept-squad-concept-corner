exports.up = function(knex) {
  return knex.schema.createTable('tags', function(table) {
    table.increments('tag_id').primary();
    table.string('tag_name');
  });
};
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tags');
};
