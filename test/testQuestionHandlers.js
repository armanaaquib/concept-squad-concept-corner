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
});
