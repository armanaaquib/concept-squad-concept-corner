const { assert } = require('chai');
const { mock } = require('sinon');
const Users = require('../../models/users');

describe('Users', function() {
  let dataStore;
  beforeEach(() => {
    dataStore = {};
  });
  context('add', function() {
    it('should add user if details are correct', async function() {
      dataStore['addUser'] = mock()
        .withArgs({
          username: 'michel',
          authLogin: 'michel',
          authSource: 'github',
          name: 'michel shawn',
          emailId: 'michel@gmail.com',
          location: 'new york',
          title: 'developer',
          aboutMe:
            'java developer worked for 20 years across different companies',
          company: 'apple',
          profilePic: null
        })
        .returns(Promise.resolve(true));

      const users = new Users(dataStore);

      const isAdded = await users.add({
        username: 'michel',
        authLogin: 'michel',
        authSource: 'github',
        name: 'michel shawn',
        emailId: 'michel@gmail.com',
        location: 'new york',
        title: 'developer',
        aboutMe:
          'java developer worked for 20 years across different companies',
        company: 'apple',
        profilePic: null
      });

      assert.isOk(isAdded);
    });
  });

  context('hasUser', function() {
    it('should give username if user exists', async function() {
      dataStore['getUser'] = mock()
        .withArgs('michel')
        .returns(Promise.resolve({ username: 'michel' }));

      const users = new Users(dataStore);

      const username = await users.hasUser('michel');

      assert.strictEqual(username, 'michel');
    });

    it('should give undefined if user not exists', async function() {
      dataStore['getUser'] = mock()
        .withArgs('ram')
        .returns(Promise.resolve(undefined));

      const users = new Users(dataStore);

      const username = await users.hasUser('ram');

      assert.isUndefined(username);
    });
  });
});
