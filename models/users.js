class Users {
  constructor(dataStore) {
    this.dataStore = dataStore;
  }

  add(details) {
    return this.dataStore.addUser(details);
  }

  hasUser(username) {
    return new Promise(resolve => {
      this.dataStore.getUser(username).then(userDetails => {
        resolve(userDetails && userDetails.username);
      });
    });
  }

  getUserDetail(login, source) {
    return this.dataStore.getRegisteredUser(login, source);
  }
}
module.exports = Users;
