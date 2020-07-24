const { assert } = require('chai');
const { exec } = require('child_process');
const sqlite = require('sqlite3');
const { getDBFilePath } = require('../config');

const DataStore = require('../database/dataStore.js');
const { stdout, stderr } = require('process');

describe('DataStore', function () {
  let dataStore;
  beforeEach(() => {
    const db = new sqlite.Database(getDBFilePath());
    dataStore = new DataStore(db);
  });

  context('addUser', function () {
    it('should add a user', async function () {
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
        profilePic: null,
      });

      assert.ok(status);
    });
  });

  context('getUser', function () {
    it('should resolve user details if user is available', async function () {
      const user = await dataStore.getUser('jake');

      assert.deepStrictEqual(user, {
        username: 'jake',
        name: 'jake shawn',
        email: 'jake@gmail.com',
        location: 'london',
        title: 'project manager',
        aboutMe: null,
        company: null,
        profilePic: null,
      });
    });

    it('should resolve undefined if user is not available', async function () {
      const user = await dataStore.getUser('Bold');
      assert.isUndefined(user);
    });
  });

  context('addQuestion', function () {
    it('should add a question', async function () {
      const questionId = await dataStore.addQuestion({
        username: 'michel',
        title: 'question title',
        description: 'question description',
      });

      assert.strictEqual(questionId, 6);
    });
  });

  context('getQuestions', function () {
    it('should gives all questions in reverse order by date', function (done) {
      exec('npm run populate_test_data', () => {
        const db = new sqlite.Database(getDBFilePath());
        dataStore = new DataStore(db);

        const expectedQuestions = [
          {
            questionId: 5,
            username: 'carlo',
            title: 'Question 5',
            description: 'Description 5',
            time: new Date('2020-07-21 11:24:35'),
            views: 9,
          },
          {
            questionId: 4,
            username: 'jake',
            title: 'Question 4',
            description: 'Description 4',
            time: new Date('2020-07-21 11:20:35'),
            views: 7,
          },
          {
            questionId: 3,
            username: 'jake',
            title: 'Question 3',
            description: null,
            time: new Date('2020-07-21 11:15:35'),
            views: 5,
          },
          {
            questionId: 2,
            username: 'michel',
            title: 'Question 2',
            description: 'Description 2',
            time: new Date('2020-07-20 11:24:35'),
            views: 9,
          },
          {
            questionId: 1,
            username: 'michel',
            title: 'Question Title 1',
            description: 'Description 1',
            time: new Date('2020-07-20 11:20:35'),
            views: 10,
          },
        ];

        dataStore.getQuestions().then((questions) => {
          assert.deepStrictEqual(questions, expectedQuestions);
          done();
        });
      });
    });
  });
});
