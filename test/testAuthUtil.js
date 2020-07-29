const request = require('request');
const { replace, restore, fake } = require('sinon');
const authUtils = require('../src/authUtils');
const { assert } = require('chai');
const { env } = process;

describe('getAccessToken', function () {
  it('should give access token for valid code', function (done) {
    const callback = fake.yields(
      null,
      null,
      JSON.stringify({ access_token: 'access-token' })
    );
    replace(request, 'post', callback);

    env.CLIENT_ID = 'client-id';
    env.CLIENT_SECRET = 'client-secret';

    const arg = {
      url: 'https://github.com/login/oauth/access_token',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: 'client-id',
        client_secret: 'client-secret',
        code: '123',
      }),
    };

    authUtils.getAccessToken('123').then((accessToken) => {
      assert.strictEqual(accessToken, 'access-token');
      assert.ok(callback.calledOnce);
      assert.deepStrictEqual(callback.args[0][0], arg);
      done();
    });

    restore();
  });
});

describe('getUserDetail', function () {
  it('should give access token for valid code', function (done) {
    const callback = fake.yields(
      null,
      null,
      JSON.stringify({ login: 'michel' })
    );
    replace(request, 'get', callback);

    const arg = {
      url: 'https://api.github.com/user',
      headers: {
        Authorization: 'token access-token',
        'User-Agent': 'node.js',
      },
    };

    authUtils.getUserDetail('access-token').then((userDetail) => {
      assert.deepStrictEqual(userDetail, { login: 'michel' });
      assert.ok(callback.calledOnce);
      assert.deepStrictEqual(callback.args[0][0], arg);
      done();
    });

    restore();
  });
});
