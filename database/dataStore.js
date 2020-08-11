const queries = require('./queries');

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
    isAnswerAccepted: row.is_answer_accepted === 1 ? true : false
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
    lastModified: row.last_modified
  };
};

const wrapComment = (row) => {
  return {
    username: row.username,
    commentId: row.comment_id,
    comment: row.comment,
    time: new Date(row.time)
  };
};

class DataStore {
  constructor(db, newdb) {
    this.db = db;
    this.newdb = newdb;
  }

  addUser(user) {
    const fields = {
      name: user.name,
      about_me: user.aboutMe,
      auth_login: user.authLogin,
      auth_source: user.authSource,
      username: user.username,
      title: user.title,
      company: user.company,
      location: user.location,
      email: user.emailId,
      profile_pic: user.profilePic
    };
    return new Promise((resolve, reject) => {
      this.newdb('users')
        .insert(fields)
        .then(() => {
          resolve(true);
        })
        .catch(reject);
    });
  }

  getUser(username) {
    return new Promise((resolve, reject) => {
      this.newdb('users')
        .select([
          'username',
          'name',
          'email',
          'location',
          'title',
          'about_me as aboutMe',
          'company',
          'profile_pic as profilePic'
        ])
        .where({ username })
        .then(([row]) => {
          resolve(row);
        })
        .catch(reject);
    });
  }

  getRegisteredUser(authLogin, authSource) {
    const fields = ['username', 'profile_pic as profilePic'];
    const filteringBy = { auth_login: authLogin, auth_source: authSource };
    return new Promise((resolve, reject) => {
      this.newdb('users')
        .select(fields)
        .where(filteringBy)
        .first()
        .then((row) => {
          resolve(row);
        })
        .catch(reject);
    });
  }

  addQuestion(question) {
    const { username, title, description, tags } = question;
    return new Promise((resolve, reject) => {
      this.newdb('questions')
        .insert({ username, title, description })
        .then(([questionId]) => {
          this.addQuestionTag(questionId, tags)
            .then(() => resolve(questionId))
            .catch(reject);
        })
        .catch(reject);
    });
  }

  updateQuestionTag(questionId, tags) {
    return new Promise((resolve, reject) => {
      this.db.run(queries.deleteQuestionTag, [questionId], (err) => {
        if (err) {
          reject(err);
          return;
        }
        this.addQuestionTag(questionId, tags).then((isadded) => {
          isadded && resolve(questionId);
        });
      });
    });
  }

  updateQuestion(question) {
    return new Promise((resolve, reject) => {
      this.db.run(
        queries.updateQuestion,
        [question.title, question.description, question.questionId],
        (err) => {
          if (err) {
            reject(err);
          }
          this.updateQuestionTag(question.questionId, question.tags)
            .then(resolve)
            .catch(reject);
        }
      );
    });
  }

  getTags(questionId) {
    return new Promise((resolve, reject) => {
      this.db.all(queries.getQuestionTags, [questionId], function(err, rows) {
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
          .run(queries.updateAnswerCount, [questionId], function(err) {
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

  getVote(username, answerId) {
    return new Promise((resolve, reject) => {
      this.db.get(queries.getVote, [username, answerId], (err, row) => {
        err && reject(err);
        const vote = row || {};
        resolve(vote.vote);
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
        this.db.run(queries.addTag, [tag], function(err) {
          err && reject(err);
          resolve(this.lastID);
        });
      });
    });
  }

  getTagSuggestion(tagname) {
    return new Promise((resolve, reject) => {
      this.db.all(queries.getTagSuggestion, [`%${tagname}%`], (err, rows) => {
        err && reject(err);
        const matchingTags = rows.map((row) => row.tag_name);
        resolve(matchingTags);
      });
    });
  }

  updateVote(username, answerId, vote) {
    return new Promise((resolve, reject) => {
      this.db.run(
        queries.updateVote,
        [vote, username, answerId],
        async (err) => {
          err && reject(err);
          const votes = await this.getVotesOfAnswer(answerId);
          resolve(votes);
        }
      );
    });
  }

  addVote(username, answerId, vote) {
    return new Promise((resolve, reject) => {
      this.db.run(queries.addVote, [username, answerId, vote], async (err) => {
        err && reject(err);
        const votes = await this.getVotesOfAnswer(answerId);
        resolve(votes);
      });
    });
  }

  deleteVote(username, answerId) {
    return new Promise((resolve, reject) => {
      this.db.run(queries.deleteVote, [username, answerId], async (err) => {
        err && reject(err);
        const votes = await this.getVotesOfAnswer(answerId);
        resolve(votes);
      });
    });
  }

  addQuestionComment(username, questionId, comment) {
    return new Promise((resolve, reject) => {
      this.db.run(
        queries.addQuestionComment,
        [username, questionId, comment],
        function(err) {
          err && reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  getCommentsOfQuestion(questionId) {
    return new Promise((resolve, reject) => {
      this.db.all(queries.getCommentsOfQuestion, [questionId], (err, rows) => {
        err && reject(err);
        if (!rows) {
          resolve([]);
        }
        let comments = rows || [];
        comments = comments.map(wrapComment);
        resolve(comments);
      });
    });
  }

  getCommentsOfAnswer(answerId) {
    return new Promise((resolve, reject) => {
      this.db.all(queries.getCommentsOfAnswer, [answerId], (err, rows) => {
        err && reject(err);
        if (!rows) {
          resolve([]);
        }
        let comments = rows || [];
        comments = comments.map(wrapComment);
        resolve(comments);
      });
    });
  }

  addAnswerComment(username, answerId, comment) {
    return new Promise((resolve, reject) => {
      this.db.run(
        queries.addAnswerComment,
        [username, answerId, comment],
        function(err) {
          err && reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  getComment(commentId) {
    return new Promise((resolve, reject) => {
      this.db.get(queries.getComment, [commentId], (err, rows) => {
        err && reject(err);
        if (!rows) {
          resolve([]);
        }
        let comment = rows || {};
        comment = wrapComment(comment);
        resolve(comment);
      });
    });
  }

  deleteQuestionComment(commentId) {
    return new Promise((resolve, reject) => {
      this.db.run(queries.deleteQuestionComment, [commentId], (err) => {
        err && reject(err);
        resolve(true);
      });
    });
  }

  deleteAnswerComment(commentId) {
    return new Promise((resolve, reject) => {
      this.db.run(queries.deleteAnswerComment, [commentId], (err) => {
        err && reject(err);
        resolve(true);
      });
    });
  }

  deleteAnswer(answerId) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db
          .run('PRAGMA foreign_keys = ON;')
          .run(queries.deleteAnswer, [answerId], function(err) {
            err && reject(err);
            resolve(true);
          });
      });
    });
  }

  deleteQuestion(questionId) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db
          .run('PRAGMA foreign_keys = ON;')
          .run(queries.deleteQuestion, [questionId], function(err) {
            err && reject(err);
            resolve(true);
          });
      });
    });
  }
}

module.exports = DataStore;
