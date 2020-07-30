const queries = require('./queries');

const wrapUser = (row) => {
  return {
    username: row.username,
    name: row.name,
    email: row.email,
    location: row.location,
    title: row.title,
    aboutMe: row.about_me,
    company: row.company,
    profilePic: row.profile_pic,
  };
};

const wrapQuestion = (row) => {
  return {
    questionId: row.question_id,
    username: row.username,
    profilePic: row.profile_pic,
    title: row.title,
    description: row.description,
    time: new Date(row.time),
    lastModified: row.last_modified,
    views: row.view_count,
    noOfAnswers: row.no_of_answers,
    isAnswerAccepted: row.is_answer_accepted === 1 ? true : false,
  };
};

const wrapAnswer = (row) => {
  return {
    username: row.username,
    questionId: row.question_id,
    answerId: row.answer_id,
    answer: row.answer,
    accepted: row.accepted === 1 ? true : false,
    time: new Date(row.time),
    lastModified: row.last_modified,
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
          user.profilePic,
        ],
        (err) => {
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
          resolve({ username: row.username, profilePic: row.profile_pic });
        }
      );
    });
  }

  addQuestion(question) {
    return new Promise((resolve, reject) => {
      const dataStoreInstance = this;
      this.db.run(
        queries.addQuestion,
        [question.username, question.title, question.description],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          const questionId = this.lastID;
          dataStoreInstance
            .addQuestionTag(questionId, question.tags)
            .then((isadded) => {
              isadded && resolve(questionId);
            });
        }
      );
    });
  }

  getTags(questionId) {
    return new Promise((resolve, reject) => {
      this.db.all(queries.getQuestionTags, [questionId], function (err, rows) {
        err && reject(err);
        resolve(rows.map((row) => row.tag_name));
      });
    });
  }

  getQuestion(questionId) {
    return new Promise((resolve, reject) => {
      this.db.get(queries.getQuestion, [questionId], async (err, row) => {
        err && reject(err);

        if (!row) {
          resolve(row);
          return;
        }
        const question = wrapQuestion(row);
        question['tags'] = await this.getTags(question.questionId);
        resolve(question);
      });
    });
  }

  getQuestions() {
    return new Promise((resolve, reject) => {
      this.db.all(queries.getQuestions, async (err, rows) => {
        err && reject(err);
        const questions = [];
        for (const row of rows) {
          const question = wrapQuestion(row);
          question['tags'] = await this.getTags(question.questionId);
          questions.push(question);
        }
        resolve(questions);
      });
    });
  }

  acceptAnswer(questionId, answerId) {
    return new Promise((resolve, reject) => {
      this.db.run(queries.acceptAnswer, [answerId], (err) => {
        err && reject(err);
        this.db.run(queries.setAnswerAccepted, [questionId], (err) => {
          err && reject(err);
          resolve(true);
        });
      });
    });
  }

  addAnswer(username, questionId, answer) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db
          .run(queries.addAnswer, [username, questionId, answer])
          .run(queries.updateAnswerCount, [questionId], function (err) {
            err && reject(err);
            resolve(this.lastID);
          });
      });
    });
  }

  getVotesOfAnswer(answerId) {
    return new Promise((resolve, reject) => {
      this.db.all(queries.getVotesOfAnswer, [answerId], (err, rows) => {
        err && reject(err);
        const votes = { up: 0, down: 0 };
        for (const row of rows) {
          votes[row.vote] = row.vote_count;
        }
        resolve(votes);
      });
    });
  }

  getAnswers(questionId) {
    return new Promise((resolve, reject) => {
      this.db.all(queries.getAnswers, [questionId], async (err, rows) => {
        err && reject(err);

        const answers = [];
        for (const row of rows) {
          const answer = wrapAnswer(row);
          const votes = await this.getVotesOfAnswer(answer.answerId);
          answer.upVote = votes['up'];
          answer.downVote = votes['down'];
          answers.push(answer);
        }
        resolve(answers);
      });
    });
  }

  addQuestionTag(questionId, tags) {
    return new Promise((resolve, reject) => {
      tags.forEach((tag, index) => {
        this.getTagId(tag).then((tagId) => {
          this.db.run(queries.addQuestionTag, [questionId, tagId], (err) => {
            err && reject(err);
            if (index == tags.length - 1) {
              resolve(true);
            }
          });
        });
      });
    });
  }

  getTagId(tag) {
    return new Promise((resolve, reject) => {
      this.db.get(queries.getTagId, [tag], (err, rows) => {
        err && reject(err);
        if (rows) {
          resolve(rows.tag_id);
          return;
        }
        this.db.run(queries.addTag, [tag], function (err) {
          err && reject(err);
          resolve(this.lastID);
        });
      });
    });
  }
}

module.exports = DataStore;
