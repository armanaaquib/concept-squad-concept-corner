const sqlite = require('sqlite3').verbose();
const { getDBFileName } = require('../config');

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
  const dbFileName = `./database/${getDBFileName()}`;
  const db = new sqlite.Database(dbFileName, throwError);

  db.run(schema.users, [], throwError);
  db.close(throwError);
};

createTables();
