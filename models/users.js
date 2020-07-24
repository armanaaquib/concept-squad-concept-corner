class Users {
  constructor(dataStore){
    this.dataStore = dataStore;
  }
  add(details){
    this.dataStore.addUser(details);
  }
  getUserDetail(login, source){
    return this.dataStore.getRegisteredUser(login, source);
  }
}
module.exports = Users;
