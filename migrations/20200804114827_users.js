
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.string('username')
      .primary();
    table.string('name')
      .notNullable();
    table.string('email');
    table.string('title');
    table.string('company');
    table.string('location');
    table.string('auth_login');
    table.string('about_me');
    table.string('auth_source');
    table.string('profile_pic');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
