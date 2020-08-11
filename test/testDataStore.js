const { assert } = require('chai');
const { fake, stub, mock } = require('sinon');

const DataStore = require('../database/dataStore.js');

describe('DataStore', function() {
  let dataStore;
  let dbClient;
  beforeEach(() => {
    dbClient = {};
    dataStore = new DataStore(dbClient);
  });

  context('addUser', function() {
    it('should add a user', async function() {
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
            profile_pic: null
          })
          .returns(Promise.resolve())
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
        profilePic: null
      });
      assert.ok(newDbClient.calledOnce);
      assert.ok(status);
    });

    it('should reject error if query is not valid', function() {
      const newDbClient = stub().returns({
        insert: mock().returns(Promise.reject({ message: 'syntax error' }))
      });
      dataStore = new DataStore(null, newDbClient);
      dataStore.addUser({}).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('getUser', function() {
    it('should resolve user details if user is available', function(done) {
      const newDbClient = stub().returns({
        select: mock()
          .withArgs([
            'username',
            'name',
            'email',
            'location',
            'title',
            'about_me as aboutMe',
            'company',
            'profile_pic as profilePic'
          ])
          .returns({
            where: mock()
              .withArgs({ username: 'jake' })
              .returns(
                Promise.resolve([
                  {
                    username: 'jake',
                    name: 'jake shawn',
                    email: 'jake@gmail.com',
                    location: 'london',
                    title: 'project manager',
                    aboutMe: null,
                    company: null,
                    profilePic: null
                  }
                ])
              )
          })
      });
      dataStore = new DataStore(null, newDbClient);
      dataStore.getUser('jake').then((user) => {
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
        assert.ok(newDbClient.calledOnce);
        done();
      });
    });

    it('should give undefined if user is not available', function(done) {
      const newDbClient = stub().returns({
        select: mock().returns({
          where: mock()
            .withArgs({ username: 'Bold' })
            .returns(Promise.resolve([undefined]))
        })
      });
      dataStore = new DataStore(null, newDbClient);
      dataStore.getUser('Bold').then((user) => {
        assert.isUndefined(user);
        assert.ok(newDbClient.calledOnce);
        done();
      });
    });

    it('should reject error if query is not valid', function(done) {
      const newDbClient = stub().returns({
        select: mock().returns({
          where: mock()
            .withArgs({ username: 'Bold' })
            .returns(Promise.reject({ message: 'syntax error' }))
        })
      });
      dataStore = new DataStore(null, newDbClient);
      dataStore.getUser('Bold').catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });

  context('updateQuestion', function() {
    it('should Update a question', async function() {
      let callCount = 0;
      dbClient['run'] = function(query, params, callback) {
        assert.deepStrictEqual(params, [
          'question title',
          'question description',
          1
        ]);
        callCount++;
        callback.call({ lastID: 1 }, null);
      };

      dataStore['updateQuestionTag'] = stub()
        .withArgs(10, ['node', 'java'])
        .returns(Promise.resolve(1));

      const questionId = await dataStore.updateQuestion({
        title: 'question title',
        description: 'question description',
        tags: ['node', 'java'],
        questionId: 1
      });
      assert.strictEqual(callCount, 1);
      assert.strictEqual(questionId, 1);
    });

    it('should reject error if query is not valid', function() {
      dbClient['run'] = fake.yields({ message: 'syntax error' });
      dataStore.updateQuestion({}).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('getQuestion', function() {
    beforeEach(() => {
      dbClient = {};
      dataStore = new DataStore(dbClient);
    });
    it('should gives question according to the question id', function(done) {
      const newDbClient = stub().returns({
        select: mock()
          .withArgs([
            'title', 'description', 'time', 
            'view_count as views', 'no_of_answers as noOfAnswers', 
            'question_id as questionId', 'username', 
            'is_answer_accepted as isAnswerAccepted'
          ])
          .returns({
            where: mock().returns({
              first: mock().returns(
                Promise.resolve({
                  questionId: 5,
                  username: 'carlo',
                  title: 'Question 5',
                  description: 'Description 5',
                  time: new Date('2020-07-21 11:24:35'),
                  views: 9,
                  isAnswerAccepted: 1,
                  noOfAnswers: 3,
                  profilePic: null,
                })
              )
            })
             
          })
      });
 
      dataStore = new DataStore(null, newDbClient);

      const expectedQuestion = {
        questionId: 5,
        username: 'carlo',
        title: 'Question 5',
        description: 'Description 5',
        time: new Date('2020-07-21 11:24:35'),
        views: 9,
        isAnswerAccepted: 1,
        noOfAnswers: 3,
        profilePic: null,
        tags: ['node', 'java']
      };

      dataStore['getTags'] = stub().returns(Promise.resolve(['node', 'java']));

      dataStore.getQuestion(5).then((question) => {
        assert.deepStrictEqual(question, expectedQuestion);
        assert.ok(newDbClient.calledOnce);
        assert.ok(dataStore.getTags.calledOnceWithExactly(5));
        done();
      });
    });

    it('should reject error if query is not valid', function() {
      const newDbClient = stub().returns({
        select: mock()
          .returns({
            where: mock().returns({
              first: mock().returns(
                Promise.reject({
                  message: 'syntax error'
                })
              )
            })
             
          })
      });
      dataStore = new DataStore(null, newDbClient);
      dataStore.getQuestion(1).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('getQuestions', function() {
    it('should gives all questions in reverse order by date', function(done) {
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
          profilePic: null
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
          profilePic: null
        }
      ];

      const newDbClient = stub().returns({
        select: mock()
          .withArgs([
            'questions.question_id as questionId', 'questions.username', 
            'questions.title', 'questions.description',
            'questions.time', 'users.profile_pic as profilePic',
            'questions.view_count as views', 'questions.no_of_answers as noOfAnswers',
            'questions.is_answer_accepted as isAnswersAccepted',
          ])
          .returns({
            join: mock().withArgs('users', 'users.username', 'questions.username')
              .returns({
                orderBy: mock().withArgs('time', 'desc')
                  .returns(
                    Promise.resolve(questions)
                  )
              
              })
          })
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
          tags: ['node', 'java']
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
          tags: ['node', 'java']
        },
        
      ];
      dataStore.getQuestions().then((questions) => {
        assert.deepStrictEqual(questions, expectedQuestions);
        assert.ok(newDbClient.calledOnce);
        done();
      });
    });

    it('should reject error if query is not valid', function() {
      const newDbClient = stub().returns({
        select: mock()
          .returns({
            join: mock()
              .returns({
                orderBy: mock()
                  .returns(
                    Promise.reject({message: 'syntax error'})
                  )
          
              })
          })
      });
      dataStore = new DataStore(null, newDbClient);
      dataStore.getQuestions().catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('acceptAnswer', function() {
    it('should set an answer as accepted', async function() {
      dbClient['run'] = fake.yields(null);
      dataStore.acceptAnswer(1, 2).then((status) => {
        assert.ok(status);
        assert.deepStrictEqual(dbClient.run.args[0][1], [2]);
        assert.deepStrictEqual(dbClient.run.args[1][1], [1]);
        assert.strictEqual(dbClient.run.callCount, 2);
      });
    });

    it('should reject error if query is not valid', function() {
      dbClient['run'] = fake.yields({ message: 'syntax error' });
      dataStore.acceptAnswer(1, 2).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('addAnswer', function() {
    it('should add a answer', async function() {
      let callCount = 0;
      dbClient['serialize'] = function(callback) {
        callback();
      };
      const isValidAnswerParams = (params) => {
        return (
          params[0] === 'michel' && params[1] === 1 && params[2] === 'answer'
        );
      };
      dbClient['run'] = function(query, params, callback) {
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

    it('should reject error if query is not valid', function() {
      dbClient['serialize'] = function(callback) {
        callback();
      };
      dbClient['run'] = function(query, params, callback) {
        callback && callback({ message: 'syntax error' });
        return dbClient;
      };

      dataStore.addAnswer('michel', 1, 'answer').catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('getVotesOfAnswer', function() {
    it('should give both up and down votes of an answer if it has both', function() {
      dbClient['all'] = fake.yields(null, [
        { vote: 'up', vote_count: 2 },
        { vote: 'down', vote_count: 1 }
      ]);

      dataStore.getVotesOfAnswer(1).then((votes) => {
        assert.deepStrictEqual(votes, { up: 2, down: 1 });
        assert.ok(dbClient.all.calledOnce);
        assert.deepStrictEqual(dbClient.all.args[0][1], [1]);
      });
    });

    it('should give both up and down votes of an answer if it has only one', function() {
      dbClient['all'] = fake.yields(null, [{ vote: 'up', vote_count: 2 }]);

      dataStore.getVotesOfAnswer(1).then((votes) => {
        assert.deepStrictEqual(votes, { up: 2, down: 0 });
        assert.ok(dbClient.all.calledOnce);
        assert.deepStrictEqual(dbClient.all.args[0][1], [1]);
      });
    });

    it('should give both up and down votes as 0 of an answer if it does not have any vote', function() {
      dbClient['all'] = fake.yields(null, []);

      dataStore.getVotesOfAnswer(1).then((votes) => {
        assert.deepStrictEqual(votes, { up: 0, down: 0 });
        assert.ok(dbClient.all.calledOnce);
        assert.deepStrictEqual(dbClient.all.args[0][1], [1]);
      });
    });

    it('should give err if query is wrong', function(done) {
      dbClient['all'] = fake.yields({ message: 'syntax error' }, []);
      dataStore.getVotesOfAnswer(5).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });

  context('getAnswers', function() {
    it('should gives all answers of given question in order by date', function(done) {
      const answers = [
        {
          username: 'michel',
          answerId: 1,
          questionId: 1,
          answer: 'Answer 1',
          accepted: 1,
          time: new Date('2020-07-20 11:20:35'),
        },
        {
          username: 'bryce',
          answerId: 2,
          questionId: 1,
          answer: 'Answer 2',
          accepted: 0,
          time: new Date('2020-07-21 11:20:35'),
        },
      ];
      const newDbClient = stub().returns({
        select: mock()
          .withArgs([
            'username', 'answer_id as answerId', 
            'question_id as questionId', 'answer',
            'accepted', 'time'
          ])
          .returns({
            where: mock().withArgs({'question_id': 1}).returns({
              orderBy: mock().withArgs('accepted', 'desc')
                .returns(
                  Promise.resolve(answers)
                )
            })
          })
      });
      dataStore = new DataStore(null, newDbClient);
      dataStore['getVotesOfAnswer'] = stub();
      dataStore['getVotesOfAnswer']
        .withArgs(1)
        .returns(Promise.resolve({ up: 2, down: 1 }));
      dataStore['getVotesOfAnswer']
        .withArgs(2)
        .returns(Promise.resolve({ up: 0, down: 0 }));

      const expectedAnswers = [
        {
          username: 'michel',
          answerId: 1,
          questionId: 1,
          answer: 'Answer 1',
          upVote: 2,
          downVote: 1,
          accepted: 1,
          time: new Date('2020-07-20 11:20:35')
        },
        {
          username: 'bryce',
          answerId: 2,
          questionId: 1,
          answer: 'Answer 2',
          upVote: 0,
          downVote: 0,
          accepted: 0,
          time: new Date('2020-07-21 11:20:35')
        },
       
      ];
      dataStore.getAnswers(1).then((answers) => {

        assert.deepStrictEqual(answers, expectedAnswers);
        done();
      });
    });

    it('should reject error if query is not valid', function() {
      const newDbClient = stub().returns({
        select: mock().returns({
          where: mock().returns({
            orderBy: mock().withArgs('accepted', 'desc')
              .returns(
                Promise.reject({message: 'syntax error'})
              )
          })
        })
      });
      dataStore = new DataStore(null, newDbClient);
      dataStore.getAnswers(5).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('getVote', function() {
    it('should give vote of user for given answer if user has voted', function() {
      dbClient['get'] = fake.yields(null, { vote: 'up' });
      dataStore.getVote('michel', 1).then((vote) => {
        assert.strictEqual(vote, 'up');
        assert.ok(dbClient.get.calledOnce);
        assert.deepStrictEqual(dbClient.get.args[0][1], ['michel', 1]);
      });
    });

    it('should give vote undefined of user for given answer if user has not voted', function() {
      dbClient['get'] = fake.yields(null, undefined);
      dataStore.getVote('michel', 2).then((vote) => {
        assert.isUndefined(vote);
        assert.ok(dbClient.get.calledOnce);
        assert.deepStrictEqual(dbClient.get.args[0][1], ['michel', 2]);
      });
    });

    it('should reject error if get throws error', function(done) {
      dbClient['get'] = fake.yields({ message: 'syntax error' });
      dataStore.getVote('michel', 1).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });

  context('getTagId', function() {
    it('should give tagId if tag is already present', function(done) {
      dbClient['get'] = fake.yields(null, { tag_id: 1 });
      dataStore.getTagId('node').then((tagId) => {
        assert.strictEqual(tagId, 1);
        assert.isOk(dbClient.get.calledOnce);
        assert.deepStrictEqual(dbClient.get.args[0][1], ['node']);
        done();
      });
    });

    it('should give tagId if tag is not present', function(done) {
      dbClient['get'] = fake.yields(null, undefined);
      let callCount = 0;
      dbClient['run'] = function(query, params, callback) {
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

    it('should reject error if get throws error', function() {
      dbClient['get'] = fake.yields({ message: 'syntax error' });
      dataStore.getTagId({}).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });

    it('should reject error if run throws error', function() {
      dbClient['get'] = fake.yields(null, { tag_id: 1 });

      dbClient['run'] = fake.yields({ message: 'syntax error' });
      dataStore.getTagId({}).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('addQuestionTag', function() {
    it('should add question tags and give confirmation', function(done) {
      dbClient['get'] = fake.yields(null, { tag_id: 1 });
      dbClient['run'] = fake.yields(null);
      dataStore.addQuestionTag(10, ['node', 'java']).then((isAdded) => {
        assert.isOk(isAdded);
        done();
      });
    });

    it('should reject error if get throws error', function(done) {
      dbClient['get'] = fake.yields(null, { tag_id: 1 });
      dbClient['run'] = fake.yields({ message: 'syntax error' });
      dataStore.addQuestionTag(10, ['node', 'java']).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });

  context('updateQuestionTag', function() {
    it('should add question tags and give confirmation', function(done) {
      dbClient['run'] = fake.yields(null);
      dataStore['addQuestionTag'] = stub()
        .withArgs(1, ['node', 'java'])
        .returns(Promise.resolve(1));
      dataStore.updateQuestionTag(1, ['node', 'java']).then((isAdded) => {
        assert.isOk(isAdded);
        done();
      });
    });

    it('should reject error if get throws error', function(done) {
      dbClient['run'] = fake.yields({ message: 'syntax error' });
      dataStore.updateQuestionTag(1, ['node', 'java']).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });

  context('getTags', function() {
    it('should give tags belong to question_id', function(done) {
      const newDbClient = stub().returns({
        select: mock()
          .withArgs([
            'tags.tag_name'
          ])
          .returns({
            join: mock().withArgs('question_tag', 'tags.tag_id', 'question_tag.tag_id').returns({
              where: mock()
                .returns(
                  Promise.resolve([
                    {tag_name: 'node'}, {tag_name: 'java'}
                  ])
                )
            })
          })
      });
      dataStore = new DataStore(null, newDbClient);
      dataStore.getTags(5).then((tags) => {
        assert.deepStrictEqual(tags, ['node', 'java']);
        assert.ok(newDbClient.calledOnce);
        done();
      });
    });

    it('should give err if query is wrong', function(done) {
      const newDbClient = stub().returns({
        select: mock()
          .withArgs([
            'tags.tag_name'
          ])
          .returns({
            join: mock().returns({
              where: mock()
                .returns(
                  Promise.reject({message: 'syntax error'})
                )
            })
          })
      });
      dataStore = new DataStore(null, newDbClient);
      dataStore.getTags(5).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });

  context('getTagSuggestion', function() {
    it('should give tags belong to question_id', function(done) {
      dbClient['all'] = fake.yields(null, [
        { tag_name: 'nav' },
        { tag_name: 'java' }
      ]);

      dataStore.getTagSuggestion('a').then((tags) => {
        assert.deepStrictEqual(tags, ['nav', 'java']);
        assert.ok(dbClient.all.calledOnce);
        done();
      });
    });

    it('should give err if query is wrong', function(done) {
      dbClient['all'] = fake.yields({ message: 'syntax error' }, []);
      dataStore.getTagSuggestion(5).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });

  context('updateVote', function() {
    it('should update vote', function(done) {
      dbClient['run'] = fake.yields(null);
      dataStore.getVotesOfAnswer = stub().returns(
        Promise.resolve({ up: 2, down: 1 })
      );
      dataStore.updateVote('michel', 1, 'up').then((votes) => {
        assert.deepStrictEqual(votes, { up: 2, down: 1 });
        assert.ok(dbClient.run.calledOnce);
        assert.deepStrictEqual(dataStore.getVotesOfAnswer.args[0][0], 1);
        assert.deepStrictEqual(dbClient.run.args[0][1], ['up', 'michel', 1]);
        done();
      });
    });

    it('should give err if query is wrong', function(done) {
      dataStore['getVotesOfAnswer'] = stub();
      dbClient['run'] = fake.yields({ message: 'syntax error' });
      dataStore.updateVote('michel', 1, 'up').catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });

  context('addVote', function() {
    it('should add vote', function(done) {
      dbClient['run'] = fake.yields(null);
      dataStore.getVotesOfAnswer = stub().returns(
        Promise.resolve({ up: 2, down: 1 })
      );
      dataStore.addVote('michel', 1, 'up').then((votes) => {
        assert.deepStrictEqual(votes, { up: 2, down: 1 });
        assert.ok(dbClient.run.calledOnce);
        assert.deepStrictEqual(dbClient.run.args[0][1], ['michel', 1, 'up']);
        assert.deepStrictEqual(dataStore.getVotesOfAnswer.args[0][0], 1);
        done();
      });
    });

    it('should give err if query is wrong', function(done) {
      dataStore.getVotesOfAnswer = stub();
      dbClient['run'] = fake.yields({ message: 'syntax error' });
      dataStore.addVote('michel', 1, 'up').catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });

  context('addQuestionComment', function() {
    it('should add comment of the question', async function() {
      let callCount = 0;
      dbClient['run'] = function(query, params, callback) {
        callback && callback.call({ lastID: 1 }, null);
        callCount++;
        return dbClient;
      };
      const commentId = await dataStore.addQuestionComment(
        'michel',
        1,
        'comment'
      );
      assert.strictEqual(commentId, 1);
      assert.strictEqual(callCount, 1);
    });

    it('should reject error if query is not valid', function() {
      dbClient['run'] = function(query, params, callback) {
        callback && callback({ message: 'syntax error' });
        return dbClient;
      };

      dataStore.addQuestionComment('michel', 1, 'comment').catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('deleteVote', function() {
    it('should delete vote', function(done) {
      dbClient['run'] = fake.yields(null);
      dataStore.getVotesOfAnswer = stub().returns(
        Promise.resolve({ up: 2, down: 1 })
      );
      dataStore.deleteVote('michel', 1).then((votes) => {
        assert.deepStrictEqual(votes, { up: 2, down: 1 });
        assert.ok(dbClient.run.calledOnce);
        assert.deepStrictEqual(dbClient.run.args[0][1], ['michel', 1]);
        assert.deepStrictEqual(dataStore.getVotesOfAnswer.args[0][0], 1);

        done();
      });
    });

    it('should give err if query is wrong', function(done) {
      dataStore.getVotesOfAnswer = stub();
      dbClient['run'] = fake.yields({ message: 'syntax error' });
      dataStore.deleteVote('michel', 1).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });

  context('getCommentsOfQuestion', function() {
    it('should get all comments of the question', async function() {
      const comments = [
        {
          username: 'michel',
          comment_id: 1,
          comment: 'comment1',
          time: new Date('2020-07-21 11:24:35')
        }
      ];
      dbClient['all'] = fake.yields(null, comments);
      const actualComments = await dataStore.getCommentsOfQuestion(10);
      const expectedComments = [
        {
          username: 'michel',
          commentId: 1,
          comment: 'comment1',
          time: new Date('2020-07-21 11:24:35')
        }
      ];
      assert.deepStrictEqual(actualComments, expectedComments);
      assert.deepStrictEqual(dbClient['all'].args[0][1], [10]);
    });

    it('should reject error if query is not valid', function() {
      dbClient['all'] = function(query, params, callback) {
        callback && callback({ message: 'syntax error' });
        return dbClient;
      };

      dataStore.getCommentsOfQuestion(10).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('getCommentsOfAnswer', function() {
    it('should get all comments of the answer', async function() {
      const comments = [
        {
          username: 'michel',
          comment_id: 1,
          comment: 'comment1',
          time: new Date('2020-07-21 11:24:35')
        }
      ];
      dbClient['all'] = fake.yields(null, comments);
      const actualComments = await dataStore.getCommentsOfAnswer(10);
      const expectedComments = [
        {
          username: 'michel',
          commentId: 1,
          comment: 'comment1',
          time: new Date('2020-07-21 11:24:35')
        }
      ];
      assert.deepStrictEqual(actualComments, expectedComments);
      assert.deepStrictEqual(dbClient['all'].args[0][1], [10]);
    });

    it('should reject error if query is not valid', function() {
      dbClient['all'] = function(query, params, callback) {
        callback && callback({ message: 'syntax error' });
        return dbClient;
      };

      dataStore.getCommentsOfAnswer(10).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('addAnswerComment', function() {
    it('should add comment of the answer', async function() {
      let callCount = 0;
      dbClient['run'] = function(query, params, callback) {
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

    it('should reject error if query is not valid', function() {
      dbClient['run'] = function(query, params, callback) {
        callback && callback({ message: 'syntax error' });
        return dbClient;
      };

      dataStore.addAnswerComment('michel', 1, 'comment').catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('getComment', function() {
    it('should get comments of the question', async function() {
      const comment = {
        username: 'michel',
        comment_id: 1,
        comment: 'comment1',
        time: new Date('2020-07-21 11:24:35')
      };
      dbClient['get'] = fake.yields(null, comment);
      const actualComment = await dataStore.getComment(1);
      const expectedComment = {
        username: 'michel',
        commentId: 1,
        comment: 'comment1',
        time: new Date('2020-07-21 11:24:35')
      };
      assert.deepStrictEqual(actualComment, expectedComment);
    });

    it('should reject error if query is not valid', function() {
      dbClient['get'] = function(query, params, callback) {
        callback && callback({ message: 'syntax error' });
        return dbClient;
      };

      dataStore.getComment(10).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
      });
    });
  });

  context('deleteQuestionComment', function() {
    it('should delete comment of given comment id', function(done) {
      dbClient['run'] = fake.yields(null);
      dataStore.deleteQuestionComment(1).then((isDeleted) => {
        assert.ok(isDeleted);
        assert.ok(dbClient.run.calledOnce);
        assert.deepStrictEqual(dbClient.run.args[0][1], [1]);
        done();
      });
    });

    it('should give err if query is wrong', function(done) {
      dbClient['run'] = fake.yields({ message: 'syntax error' });
      dataStore.deleteQuestionComment(1).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });

  context('deleteAnswerComment', function() {
    it('should delete comment of given comment id', function(done) {
      dbClient['run'] = fake.yields(null);
      dataStore.deleteAnswerComment(1).then((isDeleted) => {
        assert.ok(isDeleted);
        assert.ok(dbClient.run.calledOnce);
        assert.deepStrictEqual(dbClient.run.args[0][1], [1]);
        done();
      });
    });

    it('should give err if query is wrong', function(done) {
      dbClient['run'] = fake.yields({ message: 'syntax error' });
      dataStore.deleteAnswerComment(1).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });

  context('deleteAnswer', function() {
    it('should delete answer of given answer id', function(done) {
      let callCount = 0;
      dbClient['serialize'] = function(callback) {
        callback();
      };
      dbClient['run'] = function(query, params, callback) {
        if (params) {
          assert.strictEqual(params[0], 1);
        }
        callCount++;
        callback && callback(null);
        return dbClient;
      };
      dataStore.deleteAnswer(1).then((isDeleted) => {
        assert.ok(isDeleted);
        assert.strictEqual(callCount, 2);
        done();
      });
    });

    it('should give err if query is wrong', function(done) {
      dbClient['serialize'] = function(callback) {
        callback();
      };
      dbClient['run'] = function(query, params, callback) {
        callback && callback({ message: 'syntax error' });
        return dbClient;
      };
      dataStore.deleteAnswer(1).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });

  context('deleteQuestion', function() {
    it('should delete Question of given question id', function(done) {
      let callCount = 0;
      dbClient['serialize'] = function(callback) {
        callback();
      };
      dbClient['run'] = function(query, params, callback) {
        if (params) {
          assert.strictEqual(params[0], 1);
        }
        callCount++;
        callback && callback(null);
        return dbClient;
      };
      dataStore.deleteQuestion(1).then((isDeleted) => {
        assert.ok(isDeleted);
        assert.strictEqual(callCount, 2);
        done();
      });
    });

    it('should give err if query is wrong', function(done) {
      dbClient['serialize'] = function(callback) {
        callback();
      };
      dbClient['run'] = function(query, params, callback) {
        callback && callback({ message: 'syntax error' });
        return dbClient;
      };
      dataStore.deleteQuestion(1).catch((err) => {
        assert.deepStrictEqual(err, { message: 'syntax error' });
        done();
      });
    });
  });
});
