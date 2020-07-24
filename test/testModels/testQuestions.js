const { assert } = require('chai');
const { mock } = require('sinon');
const Questions = require('../../models/questions');

describe('Questions', function () {
  let dataStore;
  beforeEach(() => {
    dataStore = {};
  });

  it('add', async function () {
    dataStore['addQuestion'] = mock()
      .withArgs({
        username: 'michel',
        title: 'question title',
        description: 'question description',
      })
      .returns(Promise.resolve(10));

    const questions = new Questions(dataStore);

    const questionId = await questions.add({
      username: 'michel',
      title: 'question title',
      description: 'question description',
    });

    assert.strictEqual(questionId, 10);
  });

  it('all', async function () {
    dataStore['getQuestions'] = mock().returns(
      Promise.resolve([
        {
          questionId: 5,
          username: 'carlo',
          title: 'Question 5',
          description: 'Description 5',
          time: new Date('2020-07-21 11:24:35'),
          views: 9,
        },
        {
          questionId: 4,
          username: 'jake',
          title: 'Question 4',
          description: 'Description 4',
          time: new Date('2020-07-21 11:20:35'),
          views: 7,
        },
      ])
    );

    const questions = new Questions(dataStore);
    const allQuestions = await questions.all();
    const expectedQuestions = [
      {
        questionId: 5,
        username: 'carlo',
        title: 'Question 5',
        description: 'Description 5',
        time: new Date('2020-07-21 11:24:35'),
        views: 9,
      },
      {
        questionId: 4,
        username: 'jake',
        title: 'Question 4',
        description: 'Description 4',
        time: new Date('2020-07-21 11:20:35'),
        views: 7,
      },
    ];
    assert.deepStrictEqual(allQuestions, expectedQuestions);
  });
});
