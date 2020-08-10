const request = require('supertest');
const app = require('../src/app');

describe('/question', function () {
  context('/:questionId', function () {
    it('should serve question if question is found', function (done) {
      request(app)
        .get('/question/1')
        .expect(/Concept Corner | Question Title 1/)
        .expect(200, done);
    });

    it('should serve not found page if question is not found', function (done) {
      request(app)
        .get('/question/10')
        .expect(/Concept Corner | 404 Not Found/)
        .expect(404, done);
    });
  });

  it('should give access denied if user is not author', function (done) {
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
        username: 'michel',
      })
      .expect(403, done);
  });
});

context('/post', function () {
  context('GET', function () {
    it('should redirect to / if user is not logged in', function (done) {
      request(app)
        .get('/question/post')
        .expect('location', '/')
        .expect(302, done);
    });

    it('should serve postQuestion page if user is logged in', function (done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel', profilePic: null };
      request(app)
        .get('/question/post')
        .set('Cookie', `sId=${sessionId}`)
        .expect(/Concept Corner | Post Question/)
        .expect(200, done);
    });
  });

  context('POST', function () {
    it('should add Question and redirect to question page', function (done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel', profilePic: null };
      request(app)
        .post('/question/post')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({ title: 'title', description: 'desc', tags: ['node', 'java'] })
        .expect(JSON.stringify(6))
        .expect(200, done);
    });
  });

  context('/updateQuestion', function () {
    it('should update Question and redirect to question page', function (done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel', profilePic: null };
      request(app)
        .post('/question/update')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({
          questionId: 1,
          title: 'updated title',
          description: 'updated desc',
          tags: ['node', 'javaScript'],
        })
        .expect(JSON.stringify(1))
        .expect(200, done);
    });

    it('should give access denied if user is not author', function (done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'ram', profilePic: null };
      request(app)
        .post('/question/update')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({
          questionId: 1,
          title: 'updated title',
          description: 'updated desc',
          tags: ['node', 'javaScript'],
        })
        .expect(403, done);
    });
  });

  context('/addComment', function () {
    it('should add comment to the question', function (done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel' };
      request(app)
        .post('/question/addComment')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({ questionId: 1, comment: 'comment' })
        .expect(200, done);
    });
  });

  context('/comments/:questionId', function () {
    it('should give list of comments of the question id', function (done) {
      request(app)
        .get('/question/comments/1')
        .expect(
          '[{"username":"michel","commentId":2,"comment":"comment","time":"1970-01-01T00:00:00.000Z"}]'
        )
        .expect(200, done);
    });

    it('should give empty object when the question does not have any comments', function (done) {
      request(app).get('/question/comments/89').expect([]).expect(200, done);
    });
  });

  context('/edit/:questionId', function () {
    it('should give access denied if user is not author', function (done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'ram', profilePic: null };
      request(app)
        .get('/question/edit/1')
        .set('Cookie', `sId=${sessionId}`)
        .expect(403, done);
    });

    it('should serve edit question page if user is author of question', function (done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel', profilePic: null };
      request(app)
        .get('/question/edit/1')
        .set('Cookie', `sId=${sessionId}`)
        .expect(/Concept Corner | Update Question/)
        .expect(200, done);
    });
  });

  context('/deleteQuestion', function () {
    it('should delete question comment', function (done) {
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
          username: 'michel',
        })
        .expect(JSON.stringify({ isDeleted: true }))
        .expect(200, done);
    });
  });
});
