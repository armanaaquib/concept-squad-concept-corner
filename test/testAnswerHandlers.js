const request = require('supertest');
const app = require('../src/app');

describe('/answer', function () {
  context('/post', function () {
    it('should add Answer and redirect to question page again', function (done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel' };
      request(app)
        .post('/answer/post')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({ questionId: 1, answer: 'answer' })
        .expect({ answerId: 6 })
        .expect(200, done);
    });
  });

  context('/markAccepted', function () {
    it('should accept given answer as correct if user is the author', function (done) {
      const { sessions } = app.locals;
      const sessionId = sessions.createSession();
      const session = sessions.getSession(sessionId);
      session.user = { username: 'michel', profilePic: null };
      request(app)
        .post('/answer/markAccepted')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({ questionId: 5, answerId: 1, username: 'michel' })
        .expect(200, done);
    });
  });
});
