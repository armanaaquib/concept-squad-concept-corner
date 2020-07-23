const sqlite = require('sqlite3').verbose();
const { getDBFileName } = require('../config');

const schema = require('./schema');

const throwError = (err) => {
  if (err) {
    throw err;
  }
};

const createTables = () => {
  const dbFileName = `../store/${getDBFileName()}`;
  const db = new sqlite.Database(dbFileName, throwError);

  db.run(schema.users, [], throwError);
  db.close(throwError);
};

createTables();
