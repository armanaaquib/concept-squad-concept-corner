const { assert } = require('chai');
const { mock } = require('sinon');
const Answers = require('../../models/answers');

describe('Questions', function () {
  let dataStore;
  beforeEach(() => {
    dataStore = {};
  });

  it('add', async function () {
    const answersOfQuestion = [
      {
        username: 'michel',
        answerId: 1,
        answer: 'Answer 1',
        upVote: 10,
        downVote: 3,
        accepted: true,
        time: new Date('2020-07-20 11:20:35'),
      },
      {
        username: 'bryce',
        answerId: 2,
        answer: 'Answer 2',
        upVote: 10,
        downVote: 3,
        accepted: false,
        time: new Date('2020-07-21 11:20:35'),
      },
      {
        username: 'jake',
        answerId: 3,
        answer: 'Answer 3',
        upVote: 10,
        downVote: 3,
        accepted: false,
        time: new Date('2020-07-21 12:20:35'),
      },
    ];

    dataStore['getAnswers'] = mock()
      .withArgs(5)
      .returns(Promise.resolve(answersOfQuestion));
    const answers = new Answers(dataStore);
    assert.strictEqual(await answers.of(5), answersOfQuestion);
  });
});
