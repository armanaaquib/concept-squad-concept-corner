exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.string('username').primary();
    table.string('name').notNullable();
    table.string('email');
    table.string('title').useNullAsDefault;
    table.string('company').useNullAsDefault;
    table.string('location').useNullAsDefault;
    table.string('auth_login');
    table.string('about_me').useNullAsDefault;
    table.string('auth_source');
    table.string('profile_pic').useNullAsDefault;
  });
};
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
