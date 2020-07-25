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
    return new Promise((resolve, reject) => {
      this.db.get(queries.getUser, [username], (err, row) => {
        if (err) {
          reject(err);
        }

        const user = row && {
          username: row.username,
          name: row.name,
          email: row.email,
          location: row.location,
          title: row.title,
          aboutMe: row.about_me,
          company: row.company,
          profilePic: row.profile_pic,
        };
        resolve(user);
      });
    });
  }

  getRegisteredUser(authLogin, authSource) {
    return new Promise((resolve, reject) => {
      this.db.get(
        queries.getRegisteredUser,
        [authLogin, authSource],
        (err, row) => {
          if (err) {
            reject(err);
          }
          const registeredUser = {
            authLogin: row.auth_login,
            authSource: row.auth_source,
            username: row.username,
          };
          resolve(registeredUser);
        }
      );
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
          questions.push({
            questionId: row.question_id,
            username: row.username,
            title: row.title,
            description: row.description,
            time: new Date(row.time),
            views: row.view_count,
          });
        }

        resolve(questions);
      });
    });
  }

  getAnswers(questionId) {
    return new Promise((resolve, reject) => {
      this.db.all(queries.getAnswers, [questionId], (err, rows) => {
        if (err) {
          reject(err);
        }

        const answers = [];
        for (const row of rows) {
          answers.push({
            username: row.username,
            answerId: row.answer_id,
            answer: row.answer,
            upVote: row.up_vote,
            downVote: row.down_vote,
            accepted: row.accepted === 1 ? true : false,
            time: new Date(row.time),
          });
        }

        resolve(answers);
      });
    });
  }

  getQuestion(questionId) {
    return new Promise((resolve, reject) => {
      this.db.get(queries.getQuestion, [questionId], (err, row) => {
        if (err) {
          reject(err);
        }
        resolve({
          questionId: row.question_id,
          username: row.username,
          title: row.title,
          description: row.description,
          time: new Date(row.time),
          views: row.view_count,
        });
      });
    });
  }
}

module.exports = DataStore;
