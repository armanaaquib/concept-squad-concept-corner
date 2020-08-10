const request = require('supertest');
const app = require('../src/app');

describe('handlers', function () {
  context('/', function () {
    it('serve homepage without login', function (done) {
      request(app)
        .get('/')
        .expect(/Log in/)
        .expect(200, done);
    });

    it('serve homepage with login', function (done) {
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

  context('/comment', function () {
    it('should give details of comment ', function (done) {
      request(app)
        .get('/comment/1')
        .expect(/"username":"michel","commentId":1,"comment":"comment1"/)
        .expect(200, done);
    });

    it('should give empty object comment does not exist', function (done) {
      request(app).get('/comment/89').expect([]).expect(200, done);
    });
  });
});
