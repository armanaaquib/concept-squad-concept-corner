const { assert } = require('chai');
const { mock } = require('sinon');
const Users = require('../../models/users');

describe('Users', function() {
  let dataStore;
  beforeEach(() => {
    dataStore = {};
  });

  it('add', async function() {
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
      aboutMe: 'java developer worked for 20 years across different companies',
      company: 'apple',
      profilePic: null
    });

    assert.isOk(isAdded);
  });
});
