const sqlite = require('sqlite3').verbose();
const { getDB } = require('../config');

const schema = {
  users: `
    CREATE TABLE users (
    id integer PRIMARY KEY AUTOINCREMENT,
    username varchar(20) UNIQUE,
	  name varchar(30),
	  email varchar(50)
    )`,
};

const throwError = (err) => {
  if (err) {
    throw err;
  }
};

const createTables = () => {
  const dbFile = `./database/${getDB()}`;
  const db = new sqlite.Database(dbFile, throwError);

  db.run(schema.users, [], throwError);
  db.close(throwError);
};

createTables();
