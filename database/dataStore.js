const queries = require('./queries');

class DataStore {
  constructor(db) {
    this.db = db;
  }

  addUser(user) {
    const sql = `
    INSERT INTO 
      users(username, name, email, location, title, aboutMe, company)
      values(?, ?, ?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      this.db.run(
        sql,
        [
          user.username,
          user.name,
          user.email,
          user.location,
          user.title,
          user.aboutMe,
          user.company
        ],
        err => {
          if (err) {
            reject(err);
          }
          resolve(true);
        }
      );
    });
  }

  getUser(username) {
    const sql = `
    SELECT
      username,
      name,
      email,
      location,
      title,
      aboutMe,
      company,
      profilePic 
    FROM 
      users 
    WHERE 
      username = ?
    `;

    return new Promise((resolve, reject) => {
      this.db.get(sql, [username], (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      });
    });
  }

  getRegisteredUser(authLogin, authSource) {
    const sql = `SELECT authLogin, authSource, username 
                 FROM users WHERE authLogin=? and authSource=?`;
    return new Promise((resolve, reject) => {
      this.db.get(sql, [authLogin, authSource], (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      });
    });
  }

  addQuestion(question) {
    return new Promise((resolve, reject) => {
      this.db.run(
        queries.addQuestion,
        [question.username, question.title, question.description],
        function(err) {
          if (err) {
            reject(err);
          }
          resolve(this.lastID);
        }
      );
    });
  }
}

module.exports = DataStore;
