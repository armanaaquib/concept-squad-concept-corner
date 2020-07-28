const request = require('supertest');
const app = require('../src/app');
const { mock, replace, restore } = require('sinon');
const authUtils = require('../src/authUtils');

describe('handlers', function () {
  this.beforeEach(() => {
    app.locals.users = {};
    app.locals.dataStore = {};
  });

  context('/postQuestion', function () {
    it('should redirect to / if user is not logged in', function (done) {
      request(app)
        .get('/postQuestion')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ title: 'title', description: 'desc' }))
        .expect('location', '/')
        .expect(302, done);
    });

    it('should add Question and give back question id', function (done) {
      app.locals.dataStore['addQuestion'] = mock()
        .withArgs({ title: 'title', description: 'desc', username: undefined })
        .returns(Promise.resolve(1));

      request(app)
        .post('/postQuestion')
        .set('Content-Type', 'application/json')
        .send({ title: 'title', description: 'desc' })
        .expect(JSON.stringify(1))
        .expect(200, done);
    });
  });

  context('/confirmAndSignUp', function () {
    it('should add User', function (done) {
      this.timeout(4000);
      app.locals.users['add'] = mock().returns(Promise.resolve(true));
      request(app)
        .post('/confirmAndSignUp')
        .set('Content-Type', 'multipart/form-data')
        .send(
          JSON.stringify({
            username: 'michel',
            authLogin: 'michel',
            authSource: 'github',
            name: 'michel shawn',
            emailId: 'michel@gmail.com',
            location: 'new york',
            title: 'developer',
            aboutMe:
              'java developer worked for 20 years across different companies',
            company: 'apple',
            profilePic: '',
          })
        )
        .expect(200, done);
    });
  });

  context('/confirmUser', function () {
    afterEach(() => {
      restore();
    });
    const userDetails = {
      authSource: 'github',
      name: 'michel',
    };
    it('should redirect to home page if user exists', (done) => {
      const user = {
        username: 'michel',
      };
      replace(
        authUtils,
        'getGithubUserDetails',
        mock().returns(Promise.resolve({ user, userDetails }))
      );
      request(app)
        .get('/confirmUser?code=123')
        .set('Content-Type', 'application/json')
        .expect(302, done);
    });

    it('should render confirm if user not exists', (done) => {
      replace(
        authUtils,
        'getGithubUserDetails',
        mock().returns(Promise.resolve({ user: undefined, userDetails }))
      );
      request(app)
        .get('/confirmUser?code=123')
        .set('Content-Type', 'application/json')
        .expect(/michel/)
        .expect(200, done);
    });

    it('should 404 if code query is not present', function (done) {
      request(app)
        .get('/confirmUser')
        .set('Content-Type', 'application/json')
        .expect(404, done);
    });
  });

  context('/hasUser', function () {
    it('should give availability as true when it has not user with the same name', function (done) {
      app.locals.users['hasUser'] = mock()
        .withArgs('AbC')
        .returns(Promise.resolve({ username: undefined }));

      request(app)
        .get('/hasUser/AbC')
        .set('Content-Type', 'application/json')

        .expect({ available: true })
        .expect(200, done);
    });
    it('should give availability as false when it has user with the same name', function (done) {
      app.locals.users['hasUser'] = mock()
        .withArgs('michel')
        .returns(Promise.resolve({ username: 'michel' }));

      request(app)
        .get('/hasUser/michel')
        .set('Content-Type', 'application/json')

        .expect({ available: false })
        .expect(200, done);
    });
  });
});
