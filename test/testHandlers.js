const request = require('supertest');
const app = require('../src/app');
const { mock } = require('sinon');

describe('handlers', function() {
  this.beforeEach(() => {
    app.locals.questions = {};
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
});
