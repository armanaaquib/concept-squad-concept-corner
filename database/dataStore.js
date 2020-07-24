const queries = require('./queries');

class DataStore {
  constructor(db) {
    this.db = db;
  }

  addUser(user) {
    return new Promise((resolve, reject) => {
      this.db.run(
        queries.addUser,
        [
          user.username,
          user.authLogin,
          user.authSource,
          user.name,
          user.emailId,
          user.location,
          user.title,
          user.aboutMe,
          user.company,
          user.profilePic,
        ],
        (err) => {
          if (err) {
            reject(err.message);
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
        function (err) {
          if (err) {
            reject(err);
          }
          resolve(this.lastID);
        }
      );
    });
  }

  getQuestions() {
    return new Promise((resolve, reject) => {
      this.db.all(queries.getQuestions, (err, rows) => {
        if (err) {
          reject(err);
        }

        const questions = [];
        for (const row of rows) {
          const {
            question_id,
            username,
            title,
            description,
            time,
            view_count,
          } = row;

          questions.push({
            questionId: question_id,
            username,
            title,
            description,
            time: new Date(time),
            views: view_count,
          });
        }

        resolve(questions);
      });
    });
  }
}

module.exports = DataStore;
