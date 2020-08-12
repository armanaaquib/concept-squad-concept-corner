const { assert } = require('chai');
const { fake, stub, mock } = require('sinon');

const DataStore = require('../database/dataStore.js');

describe('DataStore', function () {
  let dataStore;
  let dbClient;
  beforeEach(() => {
    dbClient = {};
    dataStore = new DataStore(dbClient);
  });

  context('addUser', function () {
    it('should add a user', async function () {
      const newDbClient = stub().returns({
        insert: mock()
          .withArgs({
            auth_login: 'ram',
            username: 'ram',
            auth_source: 'github',
            name: 'Ram Lal',
            email: 'ram@gmail.com',
            location: 'India',
            title: 'Developer',
            about_me: 'Good person',
            company: null,
            profile_pic: null,
          })
          .returns(Promise.resolve()),
      });
      dataStore = new DataStore(null, newDbClient);
      dbClient['run'] = fake.yields(null);
      const status = await dataStore.addUser({
        username: 'ram',
        authLogin: 'ram',
        authSource: 'github',
        name: 'Ram Lal',
        emailId: 'ram@gmail.com',
        location: 'India',
        title: 'Developer',
        aboutMe: 'Good person',
        company: null,
        profilePic: null,
      });
      assert.ok(newDbClient.calledOnce);
      assert.ok(status);
    });

    it('should reject error if query is not valid', function () {
      const newDbClient = stub().returns({
        insert: mock().returns(Promise.reject({ message: 'syntax error' })),
      });
      dataStore = new DataStore(null, newDbClient);
      dataStore.addUser({}).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('getQuestions', function () {
    it('should gives all questions in reverse order by date', function (done) {
      const questions = [
        {
          questionId: 5,
          username: 'carlo',
          title: 'Question 5',
          description: 'Description 5',
          time: new Date('2020-07-21 11:24:35'),
          views: 9,
          isAnswerAccepted: 1,
          noOfAnswers: 3,
          profilePic: null,
        },
        {
          questionId: 4,
          username: 'jake',
          title: 'Question 4',
          description: 'Description 4',
          time: new Date('2020-07-21 11:20:35'),
          views: 7,
          isAnswerAccepted: 0,
          noOfAnswers: 0,
          profilePic: null,
        },
      ];

      const newDbClient = stub().returns({
        select: mock()
          .withArgs([
            'questions.question_id as questionId',
            'questions.username',
            'questions.title',
            'questions.description',
            'questions.time',
            'users.profile_pic as profilePic',
            'questions.view_count as views',
            'questions.no_of_answers as noOfAnswers',
            'questions.is_answer_accepted as isAnswerAccepted',
          ])
          .returns({
            join: mock()
              .withArgs('users', 'users.username', 'questions.username')
              .returns({
                orderBy: mock()
                  .withArgs('time', 'desc')
                  .returns(Promise.resolve(questions)),
              }),
          }),
      });
      dataStore = new DataStore(null, newDbClient);

      dataStore['getTags'] = stub().returns(Promise.resolve(['node', 'java']));

      const expectedQuestions = [
        {
          questionId: 5,
          username: 'carlo',
          title: 'Question 5',
          description: 'Description 5',
          time: new Date('2020-07-21 11:24:35'),
          views: 9,
          isAnswerAccepted: 1,
          noOfAnswers: 3,
          profilePic: null,
          tags: ['node', 'java'],
        },
        {
          questionId: 4,
          username: 'jake',
          title: 'Question 4',
          description: 'Description 4',
          time: new Date('2020-07-21 11:20:35'),
          views: 7,
          isAnswerAccepted: 0,
          noOfAnswers: 0,
          profilePic: null,
          tags: ['node', 'java'],
        },
      ];
      dataStore.getQuestions().then((questions) => {
        assert.deepStrictEqual(questions, expectedQuestions);
        assert.ok(newDbClient.calledOnce);
        done();
      });
    });

    it('should reject error if query is not valid', function () {
      const newDbClient = stub().returns({
        select: mock().returns({
          join: mock().returns({
            orderBy: mock().returns(
              Promise.reject({ message: 'syntax error' })
            ),
          }),
        }),
      });
      dataStore = new DataStore(null, newDbClient);
      dataStore.getQuestions().catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('addAnswerComment', function () {
    it('should add comment of the answer', async function () {
      let callCount = 0;
      dbClient['run'] = function (query, params, callback) {
        callback && callback.call({ lastID: 1 }, null);
        callCount++;
        return dbClient;
      };
      const commentId = await dataStore.addAnswerComment(
        'michel',
        1,
        'comment'
      );
      assert.strictEqual(commentId, 1);
      assert.strictEqual(callCount, 1);
    });

    it('should reject error if query is not valid', function () {
      dbClient['run'] = function (query, params, callback) {
        callback && callback({ message: 'syntax error' });
        return dbClient;
      };

      dataStore.addAnswerComment('michel', 1, 'comment').catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });
});
