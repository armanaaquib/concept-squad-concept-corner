class Questions {
  constructor(dataStore) {
    this.dataStore = dataStore;
  }

  add(question) {
    return new Promise((resolve, reject) => {
      this.dataStore
        .addQuestion(question)
        .then(resolve)
        .catch(reject);
    });
  }
}

module.exports = Questions;
