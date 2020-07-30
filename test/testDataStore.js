const { assert } = require('chai');
const { fake, stub } = require('sinon');

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
      dbClient['get'] = fake.yields(null, {
        username: 'jake',
        profilePic: undefined,
      });

      dataStore.getRegisteredUser('jake', 'github').then((user) => {
        assert.deepStrictEqual(user, {
          username: 'jake',
          profilePic: undefined,
        });
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

      dataStore['addQuestionTag'] = stub()
        .withArgs(10, ['node', 'java'])
        .returns(Promise.resolve(10));
      const questionId = await dataStore.addQuestion({
        username: 'michel',
        title: 'question title',
        description: 'question description',
        tags: ['node', 'java'],
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
    beforeEach(() => {
      dbClient = {};
      dataStore = new DataStore(dbClient);
    });
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
        profile_pic: null,
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
        profilePic: null,
        tags: ['node', 'java'],
      };

      dataStore['getTags'] = stub().returns(Promise.resolve(['node', 'java']));

      dataStore.getQuestion(5).then((question) => {
        assert.deepStrictEqual(question, expectedQuestion);
        assert.ok(dbClient.get.calledOnce);
        assert.deepStrictEqual(dbClient.get.args[0][1], [5]);
        assert.ok(dataStore.getTags.calledOnceWithExactly(5));
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
          profile_pic: null,
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
          profile_pic: null,
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
          profile_pic: null,
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
          profile_pic: null,
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
          profile_pic: null,
        },
      ];

      dbClient['all'] = fake.yields(null, questions);
      dataStore['getTags'] = stub().returns(Promise.resolve(['node', 'java']));

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
          profilePic: null,
          tags: ['node', 'java'],
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
          profilePic: null,
          tags: ['node', 'java'],
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
          profilePic: null,
          tags: ['node', 'java'],
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
          profilePic: null,
          tags: ['node', 'java'],
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
          profilePic: null,
          tags: ['node', 'java'],
        },
      ];
      dataStore.getQuestions().then((questions) => {
        assert.deepStrictEqual(questions, expectedQuestions);
        assert.ok(dbClient.all.calledOnce);
        done();
      });
    });

    it('should reject error if query is not valid', function () {
      dbClient['all'] = fake.yields({ message: 'syntax error' }, []);
      dataStore.getQuestions().catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('acceptAnswer', function () {
    it('should set an answer as accepted', async function () {
      dbClient['run'] = fake.yields(null);
      dataStore.acceptAnswer(1, 2).then((status) => {
        assert.ok(status);
        assert.deepStrictEqual(dbClient.run.args[0][1], [2]);
        assert.deepStrictEqual(dbClient.run.args[1][1], [1]);
        assert.strictEqual(dbClient.run.callCount, 2);
      });
    });

    it('should reject error if query is not valid', function () {
      dbClient['run'] = fake.yields({ message: 'syntax error' });
      dataStore.acceptAnswer(1, 2).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('addAnswer', function () {
    it('should add a answer', async function () {
      let callCount = 0;
      dbClient['serialize'] = function (callback) {
        callback();
      };
      const isValidAnswerParams = (params) => {
        return (
          params[0] === 'michel' && params[1] === 1 && params[2] === 'answer'
        );
      };
      dbClient['run'] = function (query, params, callback) {
        const isUpdateQuestionParams = params[0] === 1;
        assert.ok(isUpdateQuestionParams || isValidAnswerParams(params));
        callCount++;
        callback && callback.call({ lastID: 10 }, null);
        return dbClient;
      };
      const answerId = await dataStore.addAnswer('michel', 1, 'answer');
      assert.strictEqual(answerId, 10);
      assert.strictEqual(callCount, 2);
    });

    it('should reject error if query is not valid', function () {
      dbClient['serialize'] = function (callback) {
        callback();
      };
      dbClient['run'] = function (query, params, callback) {
        callback && callback({ message: 'syntax error' });
        return dbClient;
      };

      dataStore.addAnswer('michel', 1, 'answer').catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('getVotesOfAnswer', function () {
    it('should give both up and down votes of an answer if it has both', function () {
      dbClient['all'] = fake.yields(null, [
        { vote: 'up', vote_count: 2 },
        { vote: 'down', vote_count: 1 },
      ]);

      dataStore.getVotesOfAnswer(1).then((votes) => {
        assert.deepStrictEqual(votes, { up: 2, down: 1 });
        assert.ok(dbClient.all.calledOnce);
        assert.deepStrictEqual(dbClient.all.args[0][1], [1]);
      });
    });

    it('should give both up and down votes of an answer if it has only one', function () {
      dbClient['all'] = fake.yields(null, [{ vote: 'up', vote_count: 2 }]);

      dataStore.getVotesOfAnswer(1).then((votes) => {
        assert.deepStrictEqual(votes, { up: 2, down: 0 });
        assert.ok(dbClient.all.calledOnce);
        assert.deepStrictEqual(dbClient.all.args[0][1], [1]);
      });
    });

    it('should give both up and down votes as 0 of an answer if it does not have any vote', function () {
      dbClient['all'] = fake.yields(null, []);

      dataStore.getVotesOfAnswer(1).then((votes) => {
        assert.deepStrictEqual(votes, { up: 0, down: 0 });
        assert.ok(dbClient.all.calledOnce);
        assert.deepStrictEqual(dbClient.all.args[0][1], [1]);
      });
    });

    it('should give err if query is wrong', function (done) {
      dbClient['all'] = fake.yields({ message: 'syntax error' }, []);
      dataStore.getVotesOfAnswer(5).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });

  context('getAnswers', function () {
    it('should gives all answers of given question in order by date', function (done) {
      const answers = [
        {
          username: 'michel',
          answer_id: 1,
          question_id: 1,
          answer: 'Answer 1',
          accepted: 1,
          time: new Date('2020-07-20 11:20:35'),
          last_modified: null,
        },
        {
          username: 'bryce',
          answer_id: 2,
          question_id: 1,
          answer: 'Answer 2',
          accepted: 0,
          time: new Date('2020-07-21 11:20:35'),
          last_modified: null,
        },
        {
          username: 'jake',
          answer_id: 3,
          question_id: 1,
          answer: 'Answer 3',
          accepted: 0,
          time: new Date('2020-07-21 12:20:35'),
          last_modified: null,
        },
      ];

      dbClient['all'] = fake.yields(null, answers);

      dataStore['getVotesOfAnswer'] = stub();

      dataStore['getVotesOfAnswer']
        .withArgs(1)
        .returns(Promise.resolve({ up: 2, down: 1 }));
      dataStore['getVotesOfAnswer']
        .withArgs(2)
        .returns(Promise.resolve({ up: 0, down: 0 }));
      dataStore['getVotesOfAnswer']
        .withArgs(3)
        .returns(Promise.resolve({ up: 0, down: 0 }));

      const expectedAnswers = [
        {
          username: 'michel',
          answerId: 1,
          questionId: 1,
          answer: 'Answer 1',
          upVote: 2,
          downVote: 1,
          accepted: true,
          time: new Date('2020-07-20 11:20:35'),
          lastModified: null,
        },
        {
          username: 'bryce',
          answerId: 2,
          questionId: 1,
          answer: 'Answer 2',
          upVote: 0,
          downVote: 0,
          accepted: false,
          time: new Date('2020-07-21 11:20:35'),
          lastModified: null,
        },
        {
          username: 'jake',
          answerId: 3,
          questionId: 1,
          answer: 'Answer 3',
          upVote: 0,
          downVote: 0,
          accepted: false,
          time: new Date('2020-07-21 12:20:35'),
          lastModified: null,
        },
      ];
      dataStore.getAnswers(1).then((answers) => {
        assert.deepStrictEqual(answers, expectedAnswers);
        done();
      });
    });

    it('should reject error if query is not valid', function () {
      dbClient['all'] = fake.yields({ message: 'syntax error' }, []);
      dataStore.getAnswers(5).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('getVote', function () {
    it('should give vote of user for given answer if user has voted', function () {
      dbClient['get'] = fake.yields(null, { vote: 'up' });
      dataStore.getVote('michel', 1).then((vote) => {
        assert.strictEqual(vote, 'up');
        assert.ok(dbClient.get.calledOnce);
        assert.deepStrictEqual(dbClient.get.args[0][1], ['michel', 1]);
      });
    });

    it('should give vote undefined of user for given answer if user has not voted', function () {
      dbClient['get'] = fake.yields(null, undefined);
      dataStore.getVote('michel', 2).then((vote) => {
        assert.isUndefined(vote);
        assert.ok(dbClient.get.calledOnce);
        assert.deepStrictEqual(dbClient.get.args[0][1], ['michel', 2]);
      });
    });

    it('should reject error if get throws error', function (done) {
      dbClient['get'] = fake.yields({ message: 'syntax error' });
      dataStore.getVote('michel', 1).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });

  context('getTagId', function () {
    it('should give tagId if tag is already present', function (done) {
      dbClient['get'] = fake.yields(null, { tag_id: 1 });
      dataStore.getTagId('node').then((tagId) => {
        assert.strictEqual(tagId, 1);
        assert.isOk(dbClient.get.calledOnce);
        assert.deepStrictEqual(dbClient.get.args[0][1], ['node']);
        done();
      });
    });
    it('should give tagId if tag is not present', function (done) {
      dbClient['get'] = fake.yields(null, undefined);
      let callCount = 0;
      dbClient['run'] = function (query, params, callback) {
        assert.deepStrictEqual(params, ['node']);
        callCount++;
        callback.call({ lastID: 1 }, null);
      };
      dataStore.getTagId('node').then((tagId) => {
        assert.strictEqual(tagId, 1);
        assert.strictEqual(callCount, 1);
        assert.deepStrictEqual(dbClient.get.args[0][1], ['node']);
        done();
      });
    });

    it('should reject error if get throws error', function () {
      dbClient['get'] = fake.yields({ message: 'syntax error' });
      dataStore.getTagId({}).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
    it('should reject error if run throws error', function () {
      dbClient['run'] = fake.yields({ message: 'syntax error' });
      dataStore.getTagId({}).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('addQuestionTag', function () {
    before(() => {
      dbClient = {};
      dataStore = new DataStore(dbClient);
    });
    it('should add question tags and give confirmation', function (done) {
      dbClient['get'] = fake.yields(null, { tag_id: 1 });
      dbClient['run'] = fake.yields(null);
      dataStore.addQuestionTag(10, ['node', 'java']).then((isAdded) => {
        assert.isOk(isAdded);
        done();
      });
    });
    it('should reject error if get throws error', function (done) {
      dbClient['run'] = fake.yields({ message: 'syntax error' });
      dataStore.addQuestionTag(10, ['node', 'java']).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });

  context('getTags', function () {
    it('should give tags belong to question_id', function (done) {
      dbClient['all'] = fake.yields(null, [
        { tag_name: 'node' },
        { tag_name: 'java' },
      ]);

      dataStore.getTags(5).then((tags) => {
        assert.deepStrictEqual(tags, ['node', 'java']);
        assert.ok(dbClient.all.calledOnce);
        done();
      });
    });

    it('should give err if query is wrong', function (done) {
      dbClient['all'] = fake.yields({ message: 'syntax error' }, []);
      dataStore.getTags(5).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });

  context('getTagSuggestion', function () {
    it('should give tags belong to question_id', function (done) {
      dbClient['all'] = fake.yields(null, [
        { tag_name: 'nav' },
        { tag_name: 'java' },
      ]);

      dataStore.getTagSuggestion('a').then((tags) => {
        assert.deepStrictEqual(tags, ['nav', 'java']);
        assert.ok(dbClient.all.calledOnce);
        done();
      });
    });

    it('should give err if query is wrong', function (done) {
      dbClient['all'] = fake.yields({ message: 'syntax error' }, []);
      dataStore.getTagSuggestion(5).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });

  context('updateVote', function () {
    it('should update vote', function (done) {
      dbClient['run'] = fake.yields(null);

      dataStore.updateVote('michel', 1, 'up').then((status) => {
        assert.ok(status);
        assert.ok(dbClient.run.calledOnce);
        assert.deepStrictEqual(dbClient.run.args[0][1], ['up', 'michel', 1]);
        done();
      });
    });

    it('should give err if query is wrong', function (done) {
      dbClient['run'] = fake.yields({ message: 'syntax error' });
      dataStore.updateVote('michel', 1, 'up').catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });

  context('addVote', function () {
    it('should add vote', function (done) {
      dbClient['run'] = fake.yields(null);

      dataStore.addVote('michel', 1, 'up').then((status) => {
        assert.ok(status);
        assert.ok(dbClient.run.calledOnce);
        assert.deepStrictEqual(dbClient.run.args[0][1], ['michel', 1, 'up']);
        done();
      });
    });

    it('should give err if query is wrong', function (done) {
      dbClient['run'] = fake.yields({ message: 'syntax error' });
      dataStore.addVote('michel', 1, 'up').catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });
});
