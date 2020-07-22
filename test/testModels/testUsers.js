const { assert } = require('chai');
const { mock } = require('sinon');

const DataStore = require('../../src/dataStore');
const Users = require('../../src/models/users');

describe('Users', function () {
  let dataStore;
  beforeEach(() => {
    dataStore = new DataStore();
  });

  it('add with then', function (done) {
    dataStore['addUser'] = mock().returns(Promise.resolve(true));
    const users = new Users(dataStore);

    users
      .add({
        username: 'michel',
        name: 'Michel Shawn',
        email: 'michel@gmail.com',
      })
      .then((status) => {
        assert.ok(status);
        done();
      });
  });

  it('add', async function () {
    dataStore['addUser'] = mock().returns(Promise.resolve(true));
    const users = new Users(dataStore);

    const status = await users.add({
      username: 'michel',
      name: 'Michel Shawn',
      email: 'michel@gmail.com',
    });

    assert.ok(status);
  });

  it('get', async function () {
    dataStore['getUser'] = mock()
      .withArgs('michel')
      .returns(
        Promise.resolve({
          username: 'michel',
          name: 'Michel Shawn',
          email: 'michel@gmail.com',
        })
      );
    const users = new Users(dataStore);

    const user = await users.get('michel');
    assert.deepStrictEqual(user, {
      username: 'michel',
      name: 'Michel Shawn',
      email: 'michel@gmail.com',
    });
  });
});
