const request = require('supertest');
const app = require('../../src/app');

describe('/answer', function () {
  let sessionId;
  let session;

  beforeEach(() => {
    const { sessions } = app.locals;
    sessionId = sessions.createSession();
    session = sessions.getSession(sessionId);
    session.user = { username: 'michel', profilePic: null };
  });

  context('/post', function () {
    it('should add Answer and redirect to question page again', function (done) {
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
      request(app)
        .post('/answer/markAccepted')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({ questionId: 5, answerId: 1, username: 'michel' })
        .expect(200, done);
    });
  });

  context('/updateVote', function () {
    it('should return total votes for given answer after change of vote status', function (done) {
      request(app)
        .post('/answer/updateVote')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({ answerId: 5, vote: 'up' })
        .expect({ up: 3, down: 0 })
        .expect(200, done);
    });

    it('should return total votes for given answer after user has removed vote', function (done) {
      session.user.username = 'bryce';
      request(app)
        .post('/answer/updateVote')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({ answerId: 1, vote: 'down' })
        .expect({ up: 2, down: 0 })
        .expect(200, done);
    });

    it('should return total votes for given answer after user has voted first time ', function (done) {
      session.user.username = 'carlo';
      request(app)
        .post('/answer/updateVote')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({ answerId: 3, vote: 'down' })
        .expect({ up: 2, down: 1 })
        .expect(200, done);
    });
  });

  context('/userVote/:answerId', function () {
    it('should return vote of user for given answer id if user has voted', function (done) {
      request(app)
        .get('/answer/userVote/1')
        .set('Cookie', `sId=${sessionId}`)
        .expect({ vote: 'up' })
        .expect(200, done);
    });

    it('should return vote undefine of user for given answer id if user has not voted', function (done) {
      session.user.username = 'carlo';
      request(app)
        .get('/answer/userVote/1')
        .set('Cookie', `sId=${sessionId}`)
        .expect({})
        .expect(200, done);
    });
  });

  context('/comments/:answerId', function () {
    it('should give list of comments of the answer id', function (done) {
      request(app)
        .get('/answer/comments/1')
        .expect(
          JSON.stringify([
            {
              username: 'michel',
              answerId: 1,
              comment: 'comment1',
              time: '2020-07-22 11:30:35',
            },
          ])
        )
        .expect(200, done);
    });

    it('should give empty object when the question does not have any comments', function (done) {
      request(app).get('/answer/comments/89').expect([]).expect(200, done);
    });
  });

  context('/addComment', function () {
    it('should add comment to the answer', function (done) {
      request(app)
        .post('/answer/addComment')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({ answerId: 1, comment: 'comment' })
        .expect(JSON.stringify(2))
        .expect(200, done);
    });
  });

  context('/deleteComment', function () {
    it('should delete question comment and redirect to question page', function (done) {
      request(app)
        .post('/answer/deleteComment')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({
          commentId: 1,
          username: 'michel',
        })
        .expect(JSON.stringify({ isDeleted: true }))
        .expect(200, done);
    });

    it('should give access denied if user is not author', function (done) {
      session.user.username = 'ram';
      request(app)
        .post('/answer/deleteComment')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({
          commentId: 10,
          username: 'michel',
        })
        .expect(403, done);
    });
  });

  context('/delete', function () {
    it('should delete answer', function (done) {
      request(app)
        .post('/answer/delete')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({
          answerId: 1,
          username: 'michel',
        })
        .expect(JSON.stringify({ isDeleted: true }))
        .expect(200, done);
    });

    it('should give access denied if user is not author', function (done) {
      session.user.username = 'ram';
      request(app)
        .post('/answer/delete')
        .set('Cookie', `sId=${sessionId}`)
        .set('Content-Type', 'application/json')
        .send({
          commentId: 2,
          username: 'michel',
        })
        .expect(403, done);
    });
  });
});
