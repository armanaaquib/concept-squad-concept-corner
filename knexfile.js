const { getDBFilePath, getTestDBFilePath } = require('./config');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: getDBFilePath()
    },
    useNullAsDefault: true
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: getTestDBFilePath()
    },
    useNullAsDefault: true
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
