const sqlite = require('sqlite3');
const { getDbFilePath } = require('../config');

const schema = require('./schema');

const throwError = err => {
  if (err) {
    throw err;
  }
};

const createTables = () => {
  const db = new sqlite.Database(getDbFilePath, throwError);
  db.run(schema.users, [], throwError);
  db.run(schema.questions, [], throwError);
  db.close(throwError);
};

createTables();
