const { assert } = require('chai');
const { fake } = require('sinon');

const DataStore = require('../database/dataStore.js');

describe('DataStore', function () {
  let dataStore;
  let dbClient;
  before(() => {
    dbClient = {};
    dataStore = new DataStore(dbClient);
  });

  context('addUser', function () {
    it('should add a user', async function () {
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
      assert.ok(dbClient.run.calledOnce);
      assert.deepStrictEqual(dbClient.run.args[0][1], [
        'ram',
        'ram',
        'github',
        'Ram Lal',
        'ram@gmail.com',
        'India',
        'Developer',
        'Good person',
        null,
        null,
      ]);
      assert.ok(status);
    });

    it('should reject error if query is not valid', function () {
      dbClient['run'] = fake.yields({ message: 'syntax error' });
      dataStore.addUser({}).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('getUser', function () {
    it('should resolve user details if user is available', function (done) {
      dbClient['get'] = fake.yields(null, {
        username: 'jake',
        name: 'jake shawn',
        email: 'jake@gmail.com',
        location: 'london',
        title: 'project manager',
        about_me: null,
        company: null,
        profile_pic: null,
      });

      dataStore.getUser('jake').then((user) => {
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
        assert.ok(dbClient.get.calledOnce);
        assert.deepStrictEqual(dbClient.get.args[0][1], ['jake']);
        done();
      });
    });

    it('should give undefined if user is not available', function (done) {
      dbClient['get'] = fake.yields(null, undefined);
      dataStore.getUser('Bold').then((user) => {
        assert.isUndefined(user);
        assert.ok(dbClient.get.calledOnce);
        assert.deepStrictEqual(dbClient.get.args[0][1], ['Bold']);
        done();
      });
    });

    it('should reject error if query is not valid', function () {
      dbClient['get'] = fake.yields({ message: 'syntax error' });
      dataStore.getUser('Bold').catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('getRegisteredUser', function () {
    it('should resolve user details if user is available', function (done) {
      dbClient['get'] = fake.yields(null, { username: 'jake' });

      dataStore.getRegisteredUser('jake', 'github').then((user) => {
        assert.deepStrictEqual(user, { username: 'jake' });
        assert.ok(dbClient.get.calledOnce);
        assert.deepStrictEqual(dbClient.get.args[0][1], ['jake', 'github']);
        done();
      });
    });

    it('should resolve undefined if user is not available', function (done) {
      dbClient['get'] = fake.yields(null, undefined);
      dataStore.getRegisteredUser('Bold', 'github').then((user) => {
        assert.isUndefined(user);
        assert.ok(dbClient.get.calledOnce);
        assert.deepStrictEqual(dbClient.get.args[0][1], ['Bold', 'github']);
        done();
      });
    });

    it('should reject error if query is not valid', function () {
      dbClient['get'] = fake.yields({ message: 'syntax error' });
      dataStore.getRegisteredUser('Bold', 'github').catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('addQuestion', function () {
    it('should add a question', async function () {
      let callCount = 0;
      dbClient['run'] = function (query, params, callback) {
        assert.deepStrictEqual(params, [
          'michel',
          'question title',
          'question description',
        ]);
        callCount++;
        callback.call({ lastID: 10 }, null);
      };
      const questionId = await dataStore.addQuestion({
        username: 'michel',
        title: 'question title',
        description: 'question description',
      });
      assert.strictEqual(callCount, 1);
      assert.strictEqual(questionId, 10);
    });

    it('should reject error if query is not valid', function () {
      dbClient['run'] = fake.yields({ message: 'syntax error' });
      dataStore.addQuestion({}).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('getQuestion', function () {
    it('should gives question according to the question id', function (done) {
      dbClient['get'] = fake.yields(null, {
        question_id: 5,
        username: 'carlo',
        title: 'Question 5',
        description: 'Description 5',
        time: new Date('2020-07-21 11:24:35'),
        last_modified: null,
        view_count: 9,
        is_answer_accepted: 1,
        no_of_answers: 3,
      });

      const expectedQuestion = {
        questionId: 5,
        username: 'carlo',
        title: 'Question 5',
        description: 'Description 5',
        time: new Date('2020-07-21 11:24:35'),
        lastModified: null,
        views: 9,
        isAnswerAccepted: true,
        noOfAnswers: 3,
      };

      dataStore.getQuestion(5).then((question) => {
        assert.deepStrictEqual(question, expectedQuestion);
        assert.ok(dbClient.get.calledOnce);
        assert.deepStrictEqual(dbClient.get.args[0][1], [5]);
        done();
      });
    });

    it('should reject error if query is not valid', function () {
      dbClient['get'] = fake.yields({ message: 'syntax error' });
      dataStore.getQuestion(1).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('getQuestions', function () {
    it('should gives all questions in reverse order by date', function (done) {
      const questions = [
        {
          question_id: 5,
          username: 'carlo',
          title: 'Question 5',
          description: 'Description 5',
          time: new Date('2020-07-21 11:24:35'),
          last_modified: null,
          view_count: 9,
          is_answer_accepted: 1,
          no_of_answers: 3,
        },
        {
          question_id: 4,
          username: 'jake',
          title: 'Question 4',
          description: 'Description 4',
          time: new Date('2020-07-21 11:20:35'),
          last_modified: null,
          view_count: 7,
          is_answer_accepted: 0,
          no_of_answers: 0,
        },
        {
          question_id: 3,
          username: 'jake',
          title: 'Question 3',
          description: null,
          time: new Date('2020-07-21 11:15:35'),
          last_modified: null,
          view_count: 5,
          is_answer_accepted: 0,
          no_of_answers: 0,
        },
        {
          question_id: 2,
          username: 'michel',
          title: 'Question 2',
          description: 'Description 2',
          time: new Date('2020-07-20 11:24:35'),
          last_modified: null,
          view_count: 9,
          is_answer_accepted: 0,
          no_of_answers: 2,
        },
        {
          question_id: 1,
          username: 'michel',
          title: 'Question Title 1',
          description: 'Description 1',
          time: new Date('2020-07-20 11:20:35'),
          last_modified: null,
          view_count: 10,
          is_answer_accepted: 0,
          no_of_answers: 0,
        },
      ];

      dbClient['all'] = fake.yields(null, questions);

      const expectedQuestions = [
        {
          questionId: 5,
          username: 'carlo',
          title: 'Question 5',
          description: 'Description 5',
          time: new Date('2020-07-21 11:24:35'),
          lastModified: null,
          views: 9,
          isAnswerAccepted: true,
          noOfAnswers: 3,
        },
        {
          questionId: 4,
          username: 'jake',
          title: 'Question 4',
          description: 'Description 4',
          time: new Date('2020-07-21 11:20:35'),
          lastModified: null,
          views: 7,
          isAnswerAccepted: false,
          noOfAnswers: 0,
        },
        {
          questionId: 3,
          username: 'jake',
          title: 'Question 3',
          description: null,
          time: new Date('2020-07-21 11:15:35'),
          lastModified: null,
          views: 5,
          isAnswerAccepted: false,
          noOfAnswers: 0,
        },
        {
          questionId: 2,
          username: 'michel',
          title: 'Question 2',
          description: 'Description 2',
          time: new Date('2020-07-20 11:24:35'),
          lastModified: null,
          views: 9,
          isAnswerAccepted: false,
          noOfAnswers: 2,
        },
        {
          questionId: 1,
          username: 'michel',
          title: 'Question Title 1',
          description: 'Description 1',
          time: new Date('2020-07-20 11:20:35'),
          lastModified: null,
          views: 10,
          isAnswerAccepted: false,
          noOfAnswers: 0,
        },
      ];
      dataStore.getQuestions().then((questions) => {
        assert.deepStrictEqual(questions, expectedQuestions);
        assert.ok(dbClient.get.calledOnce);
        done();
      });
    });

    it('should reject error if query is not valid', function () {
      dbClient['all'] = fake.yields({ message: 'syntax error' });
      dataStore.getQuestions().catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('addAnswer', function () {
    it('should add a answer', async function () {
      let callCount = 0;
      dbClient['run'] = function (query, params, callback) {
        assert.deepStrictEqual(params, ['michel', 1, 'answer']);
        callCount++;
        callback.call({ lastID: 10 }, null);
      };
      const answerId = await dataStore.addAnswer('michel', 1, 'answer');
      assert.strictEqual(answerId, 10);
      assert.strictEqual(callCount, 1);
    });

    it('should reject error if query is not valid', function () {
      dbClient['run'] = fake.yields({ message: 'syntax error' });
      dataStore.addAnswer('michel', 1, 'answer').catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('getAnswers', function () {
    it('should gives all answers of given question in order by date', function (done) {
      const answers = [
        {
          username: 'michel',
          answer_id: 1,
          answer: 'Answer 1',
          up_vote: 10,
          down_vote: 3,
          accepted: 1,
          time: new Date('2020-07-20 11:20:35'),
          last_modified: null,
        },
        {
          username: 'bryce',
          answer_id: 2,
          answer: 'Answer 2',
          up_vote: 10,
          down_vote: 3,
          accepted: 0,
          time: new Date('2020-07-21 11:20:35'),
          last_modified: null,
        },
        {
          username: 'jake',
          answer_id: 3,
          answer: 'Answer 3',
          up_vote: 10,
          down_vote: 3,
          accepted: 0,
          time: new Date('2020-07-21 12:20:35'),
          last_modified: null,
        },
      ];

      dbClient['all'] = fake.yields(null, answers);

      const expectedAnswers = [
        {
          username: 'michel',
          answerId: 1,
          answer: 'Answer 1',
          upVote: 10,
          downVote: 3,
          accepted: true,
          time: new Date('2020-07-20 11:20:35'),
          lastModified: null,
        },
        {
          username: 'bryce',
          answerId: 2,
          answer: 'Answer 2',
          upVote: 10,
          downVote: 3,
          accepted: false,
          time: new Date('2020-07-21 11:20:35'),
          lastModified: null,
        },
        {
          username: 'jake',
          answerId: 3,
          answer: 'Answer 3',
          upVote: 10,
          downVote: 3,
          accepted: false,
          time: new Date('2020-07-21 12:20:35'),
          lastModified: null,
        },
      ];
      dataStore.getAnswers(5).then((answers) => {
        assert.deepStrictEqual(answers, expectedAnswers);
        done();
      });
    });

    it('should reject error if query is not valid', function () {
      dbClient['all'] = fake.yields({ message: 'syntax error' });
      dataStore.getAnswers(5).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });
});
