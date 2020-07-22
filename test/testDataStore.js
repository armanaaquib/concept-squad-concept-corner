const { assert } = require('chai');
const sqlite = require('sqlite3');
const { getDBFileName } = require('../config');

const dbFileName = `./database/${getDBFileName()}`;
const db = new sqlite.Database(dbFileName);
const DataStore = require('../src/dataStore');

describe('DataStore', function () {
  context('addUser', function () {
    it('should add a user', async function () {
      const dataStore = new DataStore(db);

      const status = await dataStore.addUser({
        username: 'michel',
        name: 'Michel Shawn',
        email: 'michel@gmail.com',
      });

      assert.ok(status);
    });
  });

  context('getUser', function () {
    it('should resolve user details if user is available', async function () {
      const dataStore = new DataStore(db);
      const user = await dataStore.getUser('michel');

      assert.deepStrictEqual(user, {
        username: 'michel',
        name: 'Michel Shawn',
        email: 'michel@gmail.com',
      });
    });

    it('should resolve undefined if user is not available', async function () {
      const dataStore = new DataStore(db);
      const user = await dataStore.getUser('Bold');

      assert.isUndefined(user);
    });
  });
});
