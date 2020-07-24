const { assert } = require('chai');
const { mock } = require('sinon');
const Questions = require('../../models/questions');

describe('Questions', function() {
  let dataStore;
  beforeEach(() => {
    dataStore = {};
  });

  it('add', async function() {
    dataStore['addQuestion'] = mock()
      .withArgs({
        username: 'michel',
        title: 'question title',
        description: 'question description'
      })
      .returns(Promise.resolve(10));

    const questions = new Questions(dataStore);

    const questionId = await questions.add({
      username: 'michel',
      title: 'question title',
      description: 'question description'
    });

    assert.strictEqual(questionId, 10);
  });
});
