const request = require('supertest');
const app = require('../src/app');

describe('addUser', function () {
  it('should add user', function (done) {
    request(app)
      .post('/addUser')
      .set('Content-Type', 'application/json')
      .send({
        username: 'michel',
        name: 'Michel Shawn',
        email: 'michal@gmail.com',
      })
      .expect(200, done);
  });
});

describe('getUser', function () {
  it('should get user', function (done) {
    request(app)
      .get('/getUser')
      .set('Content-Type', 'application/json')
      .send({ username: 'michel' })
      .expect(
        JSON.stringify({
          username: 'michel',
          name: 'Michel Shawn',
          email: 'michal@gmail.com',
        })
      )
      .expect(200, done);
  });
});
