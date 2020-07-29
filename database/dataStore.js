const queries = require('./queries');

const wrapUser = row => {
  return {
    username: row.username,
    name: row.name,
    email: row.email,
    location: row.location,
    title: row.title,
    aboutMe: row.about_me,
    company: row.company,
    profilePic: row.profile_pic
  };
};

const wrapQuestion = row => {
  return {
    questionId: row.question_id,
    username: row.username,
    title: row.title,
    description: row.description,
    time: new Date(row.time),
    lastModified: row.last_modified,
    views: row.view_count,
    noOfAnswers: row.no_of_answers,
    isAnswerAccepted: row.is_answer_accepted === 1 ? true : false
  };
};

const wrapAnswer = row => {
  return {
    username: row.username,
    answerId: row.answer_id,
    answer: row.answer,
    upVote: row.up_vote,
    downVote: row.down_vote,
    accepted: row.accepted === 1 ? true : false,
    time: new Date(row.time),
    lastModified: row.last_modified
  };
};

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
          user.profilePic
        ],
        err => {
          err && reject(err);
          resolve(true);
        }
      );
    });
  }

  getUser(username) {
    return new Promise((resolve, reject) => {
      this.db.get(queries.getUser, [username], (err, row) => {
        err && reject(err);

        if (!row) {
          resolve(row);
          return;
        }
        resolve(wrapUser(row));
      });
    });
  }

  getRegisteredUser(authLogin, authSource) {
    return new Promise((resolve, reject) => {
      this.db.get(
        queries.getRegisteredUser,
        [authLogin, authSource],
        (err, row) => {
          err && reject(err);

          if (!row) {
            resolve(row);
            return;
          }
          resolve({ username: row.username });
        }
      );
    });
  }

  addQuestion(question) {
    return new Promise((resolve, reject) => {
      this.db.run(
        queries.addQuestion,
        [question.username, question.title, question.description],
        function(err) {
          err && reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  getQuestion(questionId) {
    return new Promise((resolve, reject) => {
      this.db.get(queries.getQuestion, [questionId], (err, row) => {
        err && reject(err);

        if (!row) {
          resolve(row);
          return;
        }
        resolve(wrapQuestion(row));
      });
    });
  }

  getQuestions() {
    return new Promise((resolve, reject) => {
      this.db.all(queries.getQuestions, (err, rows) => {
        err && reject(err);
        const questions = [];
        for (const row of rows) {
          questions.push(wrapQuestion(row));
        }
        resolve(questions);
      });
    });
  }

  addAnswer(username, questionId, answer) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db
          .run(queries.addAnswer, [username, questionId, answer])
          .run(queries.updateAnswerCount, [questionId], function(err) {
            err && reject(err);
            resolve(this.lastID);
          });
      });
    });
  }

  getAnswers(questionId) {
    return new Promise((resolve, reject) => {
      this.db.all(queries.getAnswers, [questionId], (err, rows) => {
        err && reject(err);

        const answers = [];
        for (const row of rows) {
          answers.push(wrapAnswer(row));
        }
        resolve(answers);
      });
    });
  }
}

module.exports = DataStore;
