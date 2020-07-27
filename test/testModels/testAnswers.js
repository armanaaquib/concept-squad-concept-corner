const { assert } = require('chai');
const { mock } = require('sinon');
const Answers = require('../../models/answers');

describe('Answers', function() {
  let dataStore;
  beforeEach(() => {
    dataStore = {};
  });

  context('of', () => {
    it('should give all answer belong to questionId passed', async function() {
      const answersOfQuestion = [
        {
          username: 'michel',
          answerId: 1,
          answer: 'Answer 1',
          upVote: 10,
          downVote: 3,
          accepted: true,
          time: new Date('2020-07-20 11:20:35')
        },
        {
          username: 'bryce',
          answerId: 2,
          answer: 'Answer 2',
          upVote: 10,
          downVote: 3,
          accepted: false,
          time: new Date('2020-07-21 11:20:35')
        },
        {
          username: 'jake',
          answerId: 3,
          answer: 'Answer 3',
          upVote: 10,
          downVote: 3,
          accepted: false,
          time: new Date('2020-07-21 12:20:35')
        }
      ];

      dataStore['getAnswers'] = mock()
        .withArgs(5)
        .returns(Promise.resolve(answersOfQuestion));
      const answers = new Answers(dataStore);
      assert.strictEqual(await answers.of(5), answersOfQuestion);
    });
  });

  context('add', () => {
    it('should add answer to given question', async function() {
      dataStore['addAnswer'] = mock()
        .withArgs('michel', 1, 'answer')
        .returns(Promise.resolve(1));
      const answers = new Answers(dataStore);
      assert.strictEqual(await answers.add('michel', 1, 'answer'), 1);
    });
  });
});
