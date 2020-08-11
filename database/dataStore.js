const queries = require('./queries');

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
      this.newdb('tags').select(['tags.tag_name'])
        .join('question_tag', 'tags.tag_id', 'question_tag.tag_id')
        .where({'question_tag.question_id': questionId})
        .then((tags) => {
          const tagValues = tags.map(tag => tag.tag_name);
          resolve(tagValues);
        })
        .catch(reject);
    });
  }

  getQuestion(questionId) {
    const fields = [
      'title', 'description', 'time', 
      'view_count as views', 'no_of_answers as noOfAnswers', 
      'question_id as questionId', 'username', 
      'is_answer_accepted as isAnswerAccepted'
    ];
    const filterBy = {'question_id': questionId };

    return new Promise((resolve, reject) => {
      this.newdb('questions')
        .select(fields)
        .where(filterBy)
        .first()
        .then(async (question) => {
          !question && resolve(question);
          question['tags'] = await this.getTags(question.questionId);
          resolve(question);
        }).catch(reject);
    });
  }

  getQuestions() {
    return new Promise((resolve, reject) => {
      const fields = [
        'questions.question_id as questionId', 'questions.username', 
        'questions.title', 'questions.description',
        'questions.time', 'users.profile_pic as profilePic',
        'questions.view_count as views', 
        'questions.no_of_answers as noOfAnswers',
        'questions.is_answer_accepted as isAnswersAccepted',
      ];
      this.newdb('questions')
        .select(fields)
        .join('users', 'users.username', 'questions.username')
        .orderBy('time', 'desc')
        .then(async (rows) => {
          const questions = [];
          for (const question of rows) {
            question['tags'] = await this.getTags(question.questionId);
            questions.push(question);
          }
          resolve(questions);
        }).catch(reject);
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
      const fields = [
        'username', 'answer_id as answerId', 
        'question_id as questionId', 'answer',
        'accepted', 'time'
      ];
      this.newdb('answers')
        .select(fields)
        .where({'question_id': questionId})
        .orderBy('accepted', 'desc')
        .then(async (rows) => {
          const answers = [];
          for (const answer of rows) {
            const votes = await this.getVotesOfAnswer(answer.answerId);
            answer.upVote = votes['up'];
            answer.downVote = votes['down'];
            answers.push(answer);
          }
          resolve(answers);
        }).catch(reject);
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
