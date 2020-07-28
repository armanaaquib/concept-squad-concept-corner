const createSessionId = function() {
  return (Date.now() + Math.random()).toString().replace('.', '');
};

class Sessions {
  constructor() {
    this.sessionList = {};
  }

  getSession(sessionId) {
    return this.sessionList[sessionId];
  }

  createSession() {
    const sessionId = createSessionId();
    this.sessionList[sessionId] = {};
    return sessionId;
  }
}

module.exports = new Sessions();
