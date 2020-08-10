const request = require('supertest');
const app = require('../src/app');

describe('/user', function () {
  context('/signUp', function () {
    it('should signUp user and redirect to home page', function (done) {
      request(app)
        .post('/user/signUp')
        .set('Content-Type', 'multipart/form-data')
        //.send()
        .expect(200, done);
    });

    it('should give Bad Request if content is not valid', function (done) {
      request(app)
        .post('/user/signUp')
        .set('Content-Type', 'multipart/form-data')
        .send('wrong form data')
        .expect(400, done);
    });
  });
});
