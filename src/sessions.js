class Sessions {
  constructor() {
    this.sessionList = {};
  }

  generateSessionId() {
    const id1 = Date.now()
      .toString(36)
      .slice(0, 4);
    const id2 = Math.random()
      .toString(36)
      .substr(2, 5);
    return id1 + id2;
  }

  getSession(sessionId) {
    return this.sessionList[sessionId];
  }

  createSession() {
    const sessionId = this.generateSessionId();
    this.sessionList[sessionId] = {};
    return sessionId;
  }
}

module.exports = new Sessions();
