const app = require('./src/app');
const { env, stdout } = process;
const sqlite = require('sqlite3').verbose();
const { getDBFileName } = require('./config');
const DataStore = require('./database/dataStore');

const main = () => {
  const PORT = env.PORT || 8000;
  const dbFileName = `./store/${getDBFileName()}`;
  const db = new sqlite.Database(dbFileName);
  const dataStore = new DataStore(db);
  app.locals.dataStore = dataStore;
  app.listen(PORT, () => stdout.write(`Listening at ${PORT}\n`));
};

main();
