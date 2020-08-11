const request = require('supertest');
const app = require('../../src/app');
const { mock, replace, restore } = require('sinon');
const authUtils = require('../../src/authUtils');

describe('/user', function() {
  after(() => {
    app.locals.dataStore.newdb.destroy();
  });

  context('/has', function() {
    it('should give availability as true when it has not user with the same name', function(done) {
      request(app)
        .get('/user/has/AbC')
        .set('Content-Type', 'application/json')
        .expect({ available: true })
        .expect(200, done);
    });

    it('should give availability as false when it has user with the same name', function(done) {
      request(app)
        .get('/user/has/michel')
        .set('Content-Type', 'application/json')
        .expect({ available: false })
        .expect(200, done);
    });
  });

  context('/profile/:username', function() {
    it('should serve user profile page', function(done) {
      request(app)
        .get('/user/profile/michel')
        .expect(/michel/)
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
        .get('/user/logout')
        .set('Cookie', `sId=${sessionId}`)
        .expect('location', '/')
        .expect(302, done);
    });
  });

  context('/confirm', function() {
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
        .get('/user/confirm?code=123')
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
        .get('/user/confirm?code=123')
        .set('Content-Type', 'application/json')
        .expect(/Bobby/)
        .expect(200, done);
    });

    it('should say access denied if code query is not present', function(done) {
      request(app)
        .get('/user/confirm')
        .set('Content-Type', 'application/json')
        .set(/Access Denied/)
        .expect(403, done);
    });
  });

  context('/has', function() {
    it('should give availability as true when it has not user with the same name', function(done) {
      request(app)
        .get('/user/has/AbC')
        .set('Content-Type', 'application/json')
        .expect({ available: true })
        .expect(200, done);
    });

    it('should give availability as false when it has user with the same name', function(done) {
      request(app)
        .get('/user/has/michel')
        .set('Content-Type', 'application/json')
        .expect({ available: false })
        .expect(200, done);
    });
  });

  context('/signUp', function() {
    it('should signUp user and redirect to home page', function(done) {
      request(app)
        .post('/user/signUp')
        .set('Content-Type', 'multipart/form-data')
        //.send()
        .expect(200, done);
    });

    it('should give Bad Request if content is not valid', function(done) {
      request(app)
        .post('/user/signUp')
        .set('Content-Type', 'multipart/form-data')
        .send('wrong form data')
        .expect(400, done);
    });
  });

  context('/profile/:username', function() {
    it('should serve user profile page', function(done) {
      request(app)
        .get('/user/profile/michel')
        .expect(/michel/)
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
        .get('/user/logout')
        .set('Cookie', `sId=${sessionId}`)
        .expect('location', '/')
        .expect(302, done);
    });
  });
});
