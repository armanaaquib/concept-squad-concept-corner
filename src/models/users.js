class Users {
  constructor(dataStore) {
    this.dataStore = dataStore;
  }

  add(user) {
    return new Promise((resolve, reject) => {
      this.dataStore.addUser(user).then(resolve).catch(reject);
    });
  }

  get(username) {
    return new Promise((resolve, reject) => {
      this.dataStore.getUser(username).then(resolve).catch(reject);
    });
  }
}

module.exports = Users;
