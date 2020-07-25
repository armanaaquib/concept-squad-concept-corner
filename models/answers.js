class Answers {
  constructor(dataStore) {
    this.dataStore = dataStore;
  }

  of(questionId) {
    return new Promise((resolve, reject) => {
      this.dataStore.getAnswers(questionId).then(resolve).catch(reject);
    });
  }
}

module.exports = Answers;
