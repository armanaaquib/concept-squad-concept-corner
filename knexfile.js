const { getDBFilePath, getTestDBFilePath } = require('./config');

const afterCreate = (con, cb) => {
  con.run('PRAGMA foreign_keys = ON', cb);
};

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: getDBFilePath()
    },
    useNullAsDefault: true,
    pool: { afterCreate }
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: getTestDBFilePath()
    },
    useNullAsDefault: true,
    pool: { afterCreate }
  }
};
