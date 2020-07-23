const sqlite = require('sqlite3').verbose();
const { getDBFileName } = require('../config');

const schema = require('./schema');
const throwError = (err) => {
  if (err) {
    throw err;
  }
};

const createTables = () => {
  console.log(getDBFileName());
  const dbFileName = `./store/${getDBFileName()}`;
  const db = new sqlite.Database(dbFileName, throwError);

  db.run(schema.users, [], throwError);
  db.run(schema.githubUsers, [], throwError);
  db.close(throwError);
};

createTables();
