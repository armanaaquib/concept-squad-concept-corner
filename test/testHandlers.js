const request = require('supertest');
const app = require('../src/app');
const { mock, replace, restore } = require('sinon');
const authUtils = require('../src/authUtils');

describe('handlers', function() {
  this.beforeEach(() => {
    app.locals.questions = {};
    app.locals.users = {};
  });

  context('/postQuestion', function() {
    app.use((req, res, next) => {
      req.sessions.username = 'testuser';
      next();
    });
    //it('should render Post question page', function(done) {
    //request(app)
    //.get('/postQuestion')
    //.set('Content-Type', 'application/json')
    //.expect(/Post your question/)
    //.expect(200, done);
    //});
  });

  context('/postQuestion', function() {
    it('should add Question and give back question id', function(done) {
      app.locals.questions['add'] = mock()
        .withArgs({
          username: 'michel',
          title: 'question title',
          description: 'question description'
        })
        .returns(Promise.resolve(10));

      request(app)
        .post('/postQuestion')
        .set('Content-Type', 'application/json')
        .send({
          username: 'michel',
          title: 'question title',
          description: 'question description'
        })
        .expect('"10"')
        .expect(200, done);
    });
  });

  context('/confirmUser', function() {
    afterEach(() => {
      restore();
    });
    const userDetails = {
      authSource: 'github',
      name: 'michel'
    };
    it('should redirect to home page if user exists', done => {
      const user = {
        username: 'michel'
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

    it('should render confirm if user not exists', done => {
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

    it('should 404 if code query is not present', function(done) {
      request(app)
        .get('/confirmUser')
        .set('Content-Type', 'application/json')
        .expect(404, done);
    });
  });

  context('/hasUser', function() {
    it('should give availability as true when it has not user with the same name', function(done) {
      app.locals.users['hasUser'] = mock()
        .withArgs('AbC')
        .returns(Promise.resolve(undefined));

      request(app)
        .get('/hasUser/AbC')
        .set('Content-Type', 'application/json')

        .expect({ available: true })
        .expect(200, done);
    });
    it('should give availability as false when it has user with the same name', function(done) {
      app.locals.users['hasUser'] = mock()
        .withArgs('michel')
        .returns(Promise.resolve('michel'));

      request(app)
        .get('/hasUser/michel')
        .set('Content-Type', 'application/json')

        .expect({ available: false })
        .expect(200, done);
    });
  });
});
