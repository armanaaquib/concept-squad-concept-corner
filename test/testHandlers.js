const request = require('supertest');
const app = require('../src/app');
const { mock, replace, restore } = require('sinon');
const authUtils = require('../src/authUtils');

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

  context('/hasUser', function () {
    it('should give availability as true when it has not user with the same name', function (done) {
      request(app)
        .get('/hasUser/AbC')
        .set('Content-Type', 'application/json')
        .expect({ available: true })
        .expect(200, done);
    });

    it('should give availability as false when it has user with the same name', function (done) {
      request(app)
        .get('/hasUser/michel')
        .set('Content-Type', 'application/json')
        .expect({ available: false })
        .expect(200, done);
    });
  });

  context('/signUp', function () {
    it('should signUp user and redirect to home page', function (done) {
      request(app)
        .post('/signUp')
        .set('Content-Type', 'multipart/form-data')
        //.send()
        .expect(200, done);
    });

    it('should give Bad Request if content is not valid', function (done) {
      request(app)
        .post('/signUp')
        .set('Content-Type', 'multipart/form-data')
        .send('wrong form data')
        .expect(400, done);
    });
  });

  context('/confirmUser', function () {
    afterEach(() => {
      restore();
    });

    it('should redirect to home page if user exists', (done) => {
      replace(
        authUtils,
        'getAccessToken',
        mock().withArgs('123').returns(Promise.resolve('access-token'))
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
        mock().withArgs('123').returns(Promise.resolve('access-token'))
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

    it('should say access denied if code query is not present', function (done) {
      request(app)
        .get('/confirmUser')
        .set('Content-Type', 'application/json')
        .set(/Access Denied/)
        .expect(403, done);
    });
  });

  context('/logout', function () {
    it('should logout and redirect to /', function (done) {
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

  context('/profile/:username', function () {
    it('should serve user profile page', function (done) {
      request(app)
        .get('/profile/michel')
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
