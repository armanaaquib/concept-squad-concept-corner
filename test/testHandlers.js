const request = require('supertest');
const app = require('../src/app');
const { mock, replace, restore } = require('sinon');
const authUtils = require('../src/authUtils');

describe('handlers', function() {
  context('/', function() {
    it('serve homepage without login', function(done) {
      request(app)
        .get('/')
        .expect(/Log in/)
        .expect(200, done);
    });

    it('serve homepage with login', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.username = 'michel';
      request(app)
        .get('/')
        .set('Cookie', `sId=${sessionId}`)
        .expect(/michel/)
        .expect(200, done);
    });
  });

  context('/hasUser', function() {
    it('should give availability as true when it has not user with the same name', function(done) {
      request(app)
        .get('/hasUser/AbC')
        .set('Content-Type', 'application/json')
        .expect({ available: true })
        .expect(200, done);
    });

    it('should give availability as false when it has user with the same name', function(done) {
      request(app)
        .get('/hasUser/michel')
        .set('Content-Type', 'application/json')
        .expect({ available: false })
        .expect(200, done);
    });
  });

  context('/postQuestion', function() {
    context('GET', function() {
      it('should redirect to / if user is not logged in', function(done) {
        request(app)
          .get('/postQuestion')
          .expect('location', '/')
          .expect(302, done);
      });

      it('should serve postQuestion page if user is logged in', function(done) {
        const { sessions } = app.locals;
        const sessionId = sessions.createSession();
        const session = sessions.getSession(sessionId);
        session.user = { username: 'michel', profilePic: null };
        request(app)
          .get('/postQuestion')
          .set('Cookie', `sId=${sessionId}`)
          .expect(/Concept Corner | Post Question/)
          .expect(200, done);
      });
    });

    context('POST', function() {
      it('should add Question and redirect to question page', function(done) {
        const { sessions } = app.locals;
        const sessionId = sessions.createSession();
        const session = sessions.getSession(sessionId);
        session.user = { username: 'michel', profilePic: null };
        request(app)
          .post('/postQuestion')
          .set('Cookie', `sId=${sessionId}`)
          .set('Content-Type', 'application/json')
          .send({ title: 'title', description: 'desc', tags: ['node', 'java'] })
          .expect(JSON.stringify(6))
          .expect(200, done);
      });
    });
  });

  context('/question/:questionId', function() {
    it('should serve question if question is found', function(done) {
      request(app)
        .get('/question/1')
        .expect(/Concept Corner | Question Title 1/)
        .expect(200, done);
    });

    it('should serve not found page if question is not found', function(done) {
      request(app)
        .get('/question/10')
        .expect(/Concept Corner | 404 Not Found/)
        .expect(404, done);
    });
  });

  context('/postAnswer', function() {
    it('should add Answer and redirect to question page again', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel' };
      request(app)
        .post('/postAnswer')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({ questionId: 1, answer: 'answer' })
        .expect({ answerId: 6 })
        .expect(200, done);
    });
  });

  context('/signUp', function() {
    it('should signUp user and redirect to home page', function(done) {
      request(app)
        .post('/signUp')
        .set('Content-Type', 'multipart/form-data')
        //.send()
        .expect(200, done);
    });

    it('should give Bad Request if content is not valid', function(done) {
      request(app)
        .post('/signUp')
        .set('Content-Type', 'multipart/form-data')
        .send('wrong form data')
        .expect(400, done);
    });
  });

  context('/confirmUser', function() {
    afterEach(() => {
      restore();
    });

    it('should redirect to home page if user exists', (done) => {
      replace(
        authUtils,
        'getAccessToken',
        mock()
          .withArgs('123')
          .returns(Promise.resolve('access-token'))
      );

      replace(
        authUtils,
        'getUserDetail',
        mock()
          .withArgs('access-token')
          .returns(Promise.resolve({ login: 'michel' }))
      );

      request(app)
        .get('/confirmUser?code=123')
        .set('Content-Type', 'application/json')
        .expect('location', '/')
        .expect(302, done);
    });

    it('should render confirm if user not exists', (done) => {
      replace(
        authUtils,
        'getAccessToken',
        mock()
          .withArgs('123')
          .returns(Promise.resolve('access-token'))
      );

      replace(
        authUtils,
        'getUserDetail',
        mock()
          .withArgs('access-token')
          .returns(Promise.resolve({ login: 'Bob', name: 'Bobby' }))
      );

      request(app)
        .get('/confirmUser?code=123')
        .set('Content-Type', 'application/json')
        .expect(/Bobby/)
        .expect(200, done);
    });

    it('should say access denied if code query is not present', function(done) {
      request(app)
        .get('/confirmUser')
        .set('Content-Type', 'application/json')
        .set(/Access Denied/)
        .expect(403, done);
    });
  });

  context('/markAccept', function() {
    it('should accept given answer as correct if user is the author', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel', profilePic: null };
      request(app)
        .post('/markAccepted')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({ questionId: 5, answerId: 1, username: 'michel' })
        .expect(200, done);
    });
  });

  context('/getVote/:answerId', function() {
    it('should return vote of user for given answer id if user has voted', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel', profilePic: null };
      request(app)
        .get('/getVote/1')
        .set('Cookie', `sId=${sessionId}`)
        .expect({ vote: 'up' })
        .expect(200, done);
    });

    it('should return vote undefine of user for given answer id if user has not voted', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'carlo', profilePic: null };
      request(app)
        .get('/getVote/1')
        .set('Cookie', `sId=${sessionId}`)
        .expect({})
        .expect(200, done);
    });
  });

  context('/updateVote', function() {
    it('should return total votes for given answer after change of vote status', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel', profilePic: null };
      request(app)
        .post('/updateVote')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({ answerId: 5, vote: 'up' })
        .expect({ up: 3, down: 0 })
        .expect(200, done);
    });
    it('should return total votes for given answer after user has removed vote', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'bryce', profilePic: null };
      request(app)
        .post('/updateVote')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({ answerId: 1, vote: 'down' })
        .expect({ up: 2, down: 0 })
        .expect(200, done);
    });

    it('should return total votes for given answer after user has voted first time ', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'carlo', profilePic: null };
      request(app)
        .post('/updateVote')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({ answerId: 6, vote: 'up' })
        .expect({ up: 3, down: 1 })
        .expect(200, done);
    });
  });

  context('/getTagSuggestion', function() {
    it('should give list of matching tags', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel', profilePic: null };
      request(app)
        .get('/getTagSuggestion/a')
        .set('Cookie', `sId=${sessionId}`)
        .expect(['java', 'nav'])
        .expect(200, done);
    });

    it('should give empty array if no matching tags present', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel', profilePic: null };
      request(app)
        .get('/getTagSuggestion/z')
        .set('Cookie', `sId=${sessionId}`)
        .expect([])
        .expect(200, done);
    });
  });

  context('/addQuestionComment', function() {
    it('should add comment to the question', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel' };
      request(app)
        .post('/addQuestionComment')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({ questionId: 1, comment: 'comment' })
        .expect(200, done);
    });
  });

  context('/logout', function() {
    it('should logout and redirect to /', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel' };
      request(app)
        .get('/logout')
        .set('Cookie', `sId=${sessionId}`)
        .expect('location', '/')
        .expect(302, done);
    });
  });

  context('/profile/:username', function() {
    it('should serve user profile page', function(done) {
      request(app)
        .get('/profile/michel')
        .expect(/michel/)
        .expect(200, done);
    });
  });

  context('/getCommentsOfQuestion', function() {
    it('should give list of comments of the question id', function(done) {
      request(app)
        .get('/getCommentsOfQuestion/1')
        .expect(/"username":"michel","commentId":1,"comment":"comment1"/)
        .expect(200, done);
    });

    it('should give empty object when the question does not have any comments', function(done) {
      request(app)
        .get('/getCommentsOfQuestion/89')
        .expect([])
        .expect(200, done);
    });
  });

  context('/getCommentsOfAnswer', function() {
    it('should give list of comments of the answer id', function(done) {
      request(app)
        .get('/getCommentsOfAnswer/1')
        .expect(/"username":"michel","commentId":1,"comment":"comment1"/)
        .expect(200, done);
    });

    it('should give empty object when the question does not have any comments', function(done) {
      request(app)
        .get('/getCommentsOfAnswer/89')
        .expect([])
        .expect(200, done);
    });
  });

  context('/addAnswerComment', function() {
    it('should add comment to the answer', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel' };
      request(app)
        .post('/addAnswerComment')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({ answerId: 1, comment: 'comment' })
        .expect(JSON.stringify(2))
        .expect(200, done);
    });
  });

  context('/comment', function() {
    it('should give details of comment ', function(done) {
      request(app)
        .get('/comment/1')
        .expect(/"username":"michel","commentId":1,"comment":"comment1"/)
        .expect(200, done);
    });

    it('should give empty object comment does not exist', function(done) {
      request(app)
        .get('/comment/89')
        .expect([])
        .expect(200, done);
    });
  });

  context('/editQuestion', function() {
    it('should give access dinied if user is not author', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'ram', profilePic: null };
      request(app)
        .get('/editQuestion/1')
        .set('Cookie', `sId=${sessionId}`)
        .expect(403, done);
    });

    it('should serve edit question page if user is author of question', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel', profilePic: null };
      request(app)
        .get('/editQuestion/1')
        .set('Cookie', `sId=${sessionId}`)
        .expect(/Concept Corner | Update Question/)
        .expect(200, done);
    });
  });

  context('/updateQuestion', function() {
    it('should update Question and redirect to question page', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel', profilePic: null };
      request(app)
        .post('/updateQuestion')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({
          questionId: 1,
          title: 'updated title',
          description: 'updated desc',
          tags: ['node', 'javaScript']
        })
        .expect(JSON.stringify(1))
        .expect(200, done);
    });

    it('should give access denied if user is not author', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'ram', profilePic: null };
      request(app)
        .post('/updateQuestion')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({
          questionId: 1,
          title: 'updated title',
          description: 'updated desc',
          tags: ['node', 'javaScript']
        })
        .expect(403, done);
    });
  });

  context('/deleteQuestionComment', function() {
    it('should delete question comment', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel', profilePic: null };
      request(app)
        .post('/deleteQuestionComment')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({
          commentId: 1,
          username: 'michel'
        })
        .expect(JSON.stringify({ isDeleted: true }))
        .expect(200, done);
    });

    it('should give access denied if user is not author', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'ram', profilePic: null };
      request(app)
        .post('/deleteQuestionComment')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({
          commentId: 10,
          username: 'michel'
        })
        .expect(403, done);
    });
  });

  context('/deleteAnswer', function() {
    it('should delete answer', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel', profilePic: null };
      request(app)
        .post('/deleteAnswer')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({
          answerId: 1,
          username: 'michel'
        })
        .expect(JSON.stringify({ isDeleted: true }))
        .expect(200, done);
    });

    it('should give access denied if user is not author', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'ram', profilePic: null };
      request(app)
        .post('/deleteAnswer')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({
          commentId: 2,
          username: 'michel'
        })
        .expect(403, done);
    });
  });

  context('/deleteAnswerComment', function() {
    it('should delete question comment and redirect to question page', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel', profilePic: null };
      request(app)
        .post('/deleteAnswerComment')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({
          commentId: 1,
          username: 'michel'
        })
        .expect(JSON.stringify({ isDeleted: true }))
        .expect(200, done);
    });

    it('should give access denied if user is not author', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'ram', profilePic: null };
      request(app)
        .post('/deleteAnswerComment')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({
          commentId: 10,
          username: 'michel'
        })
        .expect(403, done);
    });
  });
  
  context('/deleteQuestion', function() {
    it('should delete question comment', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel', profilePic: null };
      request(app)
        .post('/deleteQuestion')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({
          questionId: 1,
          username: 'michel'
        })
        .expect(JSON.stringify({ isDeleted: true }))
        .expect(200, done);
    });

    it('should give access denied if user is not author', function(done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'ram', profilePic: null };
      request(app)
        .post('/deleteQuestion')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({
          questionId: 2,
          username: 'michel'
        })
        .expect(403, done);
    });
  });
});
