const { assert } = require('chai');
const sqlite = require('sqlite3');
const { getDBFilePath } = require('../config');

const db = new sqlite.Database(getDBFilePath());
const DataStore = require('../database/dataStore.js');

describe('DataStore', function() {
  context('addUser', function() {
    it('should add a user', async function() {
      const dataStore = new DataStore(db);

      const status = await dataStore.addUser({
        username: 'ram',
        authLogin: 'ram',
        authSource: 'github',
        name: 'Ram Lal',
        email: 'ram@gmail.com',
        location: 'India',
        title: 'Developer',
        aboutMe: 'Good person',
        company: null,
        profilePic: null
      });

      assert.ok(status);
    });
  });

  context('getUser', function() {
    it('should resolve user details if user is available', async function() {
      const dataStore = new DataStore(db);
      const user = await dataStore.getUser('jake');

      assert.deepStrictEqual(user, {
        username: 'jake',
        name: 'jake shawn',
        email: 'jake@gmail.com',
        location: 'london',
        title: 'project manager',
        aboutMe: null,
        company: null,
        profilePic: null
      });
    });

    it('should resolve undefined if user is not available', async function() {
      const dataStore = new DataStore(db);
      const user = await dataStore.getUser('Bold');

      assert.isUndefined(user);
    });
  });

  context('addQuestion', function() {
    it('should add a question', async function() {
      const dataStore = new DataStore(db);

      const questionId = await dataStore.addQuestion({
        username: 'michel',
        title: 'question title',
        description: 'question description'
      });

      assert.strictEqual(questionId, 10);
    });
  });
});
