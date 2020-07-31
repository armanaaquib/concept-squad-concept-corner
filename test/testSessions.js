const { assert } = require('chai');
const sessions = require('../src/sessions');
const { replace, restore, mock } = require('sinon');

describe('Sessions', function () {
  context('generateSessionId', function () {
    it('should generate new Session Id', function () {
      replace(Date, 'now', mock().returns(1595937755764));
      replace(Math, 'random', mock().returns(0.5685782182458103));
      const sessionId = sessions.generateSessionId();
      assert.strictEqual(sessionId, 'kd5wkgvl2');
      restore();
    });
  });

  context('getSession', function () {
    it('should give session with valid sessionId', () => {
      const sessionid = sessions.createSession();
      assert.deepStrictEqual(sessions.getSession(sessionid), {});
    });
    it('should give undefined with invalid sessionId', () => {
      assert.isUndefined(sessions.getSession('1234'));
    });
  });

  context('createSession', function () {
    it('should create session and give sessionID', () => {
      replace(Date, 'now', mock().returns(1595937755764));
      replace(Math, 'random', mock().returns(0.5685782182458103));
      const sessionid = sessions.createSession();
      assert.strictEqual(sessionid, 'kd5wkgvl2');
      restore();
    });
  });

  context('deleteSession', function () {
    it('should delete for given sessionID', () => {
      replace(Date, 'now', mock().returns(1595937755764));
      replace(Math, 'random', mock().returns(0.5685782182458103));
      const sessionid = sessions.createSession();
      assert.ok(sessions.removeSession(sessionid));
      restore();
    });
  });
});
