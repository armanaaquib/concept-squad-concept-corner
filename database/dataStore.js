const queries = require('./queries');

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
      profile_pic: user.profilePic,
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
    const fields = [
      'username',
      'name',
      'email',
      'location',
      'title',
      'about_me as aboutMe',
      'company',
      'profile_pic as profilePic',
    ];

    return this.newdb.select(fields).from('users').where({ username }).first();
  }

  getRegisteredUser(authLogin, authSource) {
    const fields = ['username', 'profile_pic as profilePic'];
    const filteringBy = { auth_login: authLogin, auth_source: authSource };

    return this.newdb.select(fields).from('users').where(filteringBy).first();
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
      this.newdb
        .from('question_tag')
        .where({ question_id: questionId })
        .del()
        .then(() => {
          this.addQuestionTag(questionId, tags)
            .then((isadded) => {
              isadded && resolve(questionId);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  updateQuestion(question) {
    const { description, title, questionId, tags } = question;
    return new Promise((resolve, reject) => {
      this.newdb
        .from('questions')
        .where({ question_id: questionId })
        .update({ title, description })
        .then(() => {
          this.updateQuestionTag(questionId, tags).then(resolve).catch(reject);
        })
        .catch(reject);
    });
  }

  getTags(questionId) {
    return new Promise((resolve, reject) => {
      this.newdb('tags')
        .select(['tags.tag_name'])
        .join('question_tag', 'tags.tag_id', 'question_tag.tag_id')
        .where({ 'question_tag.question_id': questionId })
        .then((tags) => {
          const tagValues = tags.map((tag) => tag.tag_name);
          resolve(tagValues);
        })
        .catch(reject);
    });
  }

  getQuestion(questionId) {
    const fields = [
      'title',
      'description',
      'time',
      'view_count as views',
      'no_of_answers as noOfAnswers',
      'question_id as questionId',
      'username',
      'is_answer_accepted as isAnswerAccepted',
    ];
    const filterBy = { question_id: questionId };

    return this.newdb
      .select(fields)
      .from('questions')
      .where(filterBy)
      .first()
      .then(async (question) => {
        if (question) {
          question['tags'] = await this.getTags(question.questionId);
        }
        return question;
      });
  }

  getQuestions() {
    return new Promise((resolve, reject) => {
      const fields = [
        'questions.question_id as questionId',
        'questions.username',
        'questions.title',
        'questions.description',
        'questions.time',
        'users.profile_pic as profilePic',
        'questions.view_count as views',
        'questions.no_of_answers as noOfAnswers',
        'questions.is_answer_accepted as isAnswerAccepted',
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
        })
        .catch(reject);
    });
  }

  acceptAnswer(questionId, answerId) {
    return new Promise((resolve, reject) => {
      this.newdb('answers')
        .where({ answer_id: answerId })
        .update({ accepted: 1 })
        .then(() => {
          this.newdb('questions')
            .update({ is_answer_accepted: 1 })
            .where({ question_id: questionId })
            .then(() => resolve(true));
        })
        .catch(reject);
    });
  }

  addAnswer(username, questionId, answer) {
    return new Promise((resolve, reject) => {
      this.newdb('answers')
        .insert({ username, answer, question_id: questionId })
        .then(async ([lastID]) => {
          await this.newdb('questions')
            .increment({ no_of_answers: 1 })
            .where({ question_id: questionId });
          resolve(lastID);
        })
        .catch(reject);
    });
  }

  getVotesOfAnswer(answerId) {
    const fields = ['vote'];
    return this.newdb
      .select(fields)
      .count('vote as vote_count')
      .from('answer_votes')
      .where({ answer_id: answerId })
      .groupBy('vote')
      .then((rows) => {
        const votes = { up: 0, down: 0 };
        for (const row of rows) {
          votes[row.vote] = row.vote_count;
        }
        return votes;
      });
  }

  getAnswers(questionId) {
    const fields = [
      'username',
      'answer_id as answerId',
      'question_id as questionId',
      'answer',
      'accepted',
      'time',
    ];

    return this.newdb
      .select(fields)
      .from('answers')
      .where({ question_id: questionId })
      .orderBy('accepted', 'desc')
      .then(async (rows) => {
        const answers = [];
        for (const answer of rows) {
          const votes = await this.getVotesOfAnswer(answer.answerId);
          answer.upVote = votes['up'];
          answer.downVote = votes['down'];
          answers.push(answer);
        }
        return answers;
      });
  }

  getVote(username, answerId) {
    return this.newdb
      .select(['vote'])
      .from('answer_votes')
      .where({ username, answer_id: answerId })
      .then(([row]) => {
        const { vote } = row || {};
        return vote;
      });
  }

  addQuestionTag(questionId, tags) {
    return new Promise((resolve, reject) => {
      tags.forEach((tag, index) => {
        this.getTagId(tag)
          .then((tagId) => {
            this.newdb('question_tag')
              .insert({ question_id: questionId, tag_id: tagId })
              .then(() => {
                if (index === tags.length - 1) {
                  resolve(true);
                }
              });
          })
          .catch(reject);
      });
    });
  }

  getTagId(tag) {
    return this.newdb
      .select('tag_id')
      .from('tags')
      .where({ tag_name: tag })
      .then(async ([row]) => {
        if (!row) {
          const [lastId] = await this.newdb('tags').insert({ tag_name: tag });
          return lastId;
        }
        return row.tag_id;
      });
  }

  getTagSuggestion(tagname) {
    return this.newdb
      .select(['tag_name'])
      .from('tags')
      .where('tag_name', 'like', `%${tagname}%`)
      .then((rows) => {
        return rows.map((row) => row.tag_name);
      });
  }

  updateVote(username, answerId, vote) {
    return new Promise((resolve, reject) => {
      this.newdb(['answer_votes'])
        .where({ username, answer_id: answerId })
        .update({ vote })
        .then(async () => {
          const votes = await this.getVotesOfAnswer(answerId);
          resolve(votes);
        })
        .catch(reject);
    });
  }

  addVote(username, answerId, vote) {
    return new Promise((resolve, reject) => {
      this.newdb('answer_votes')
        .insert({ username, answer_id: answerId, vote })
        .then(async () => {
          const votes = await this.getVotesOfAnswer(answerId);
          resolve(votes);
        })
        .catch(reject);
    });
  }

  deleteVote(username, answerId) {
    return this.newdb
      .from('answer_votes')
      .where({ username, answer_id: answerId })
      .del()
      .then(async () => {
        return await this.getVotesOfAnswer(answerId);
      });
  }

  addQuestionComment(username, questionId, comment) {
    return new Promise((resolve, reject) => {
      this.newdb('question_comments')
        .insert({ username, question_id: questionId, comment })
        .then(([lastID]) => {
          resolve(lastID);
        })
        .catch(reject);
    });
  }

  getCommentsOfQuestion(questionId) {
    const fields = [
      'username',
      'comment_id as commentId',
      'question_id as questionId',
      'comment',
      'time',
    ];

    return this.newdb
      .select(fields)
      .from('question_comments')
      .where({ question_id: questionId });
  }

  getCommentsOfAnswer(answerId) {
    const fields = [
      'username',
      'comment_id as commentId',
      'answer_id as answerId',
      'comment',
      'time',
    ];

    return this.newdb
      .select(fields)
      .from('answer_comments')
      .where({ answer_id: answerId });
  }

  addAnswerComment(username, answerId, comment) {
    return new Promise((resolve, reject) => {
      this.db.run(
        queries.addAnswerComment,
        [username, answerId, comment],
        function (err) {
          err && reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  getComment(commentId) {
    const fields = ['username', 'comment_id as commentId', 'comment', 'time'];

    return this.newdb
      .select(fields)
      .from('question_comments')
      .where({ comment_id: commentId })
      .first();
  }

  deleteQuestionComment(commentId) {
    return this.newdb
      .from('question_comments')
      .where({ comment_id: commentId })
      .del();
  }

  deleteAnswerComment(commentId) {
    return this.newdb
      .from('answer_comments')
      .where({ comment_id: commentId })
      .del();
  }

  deleteAnswer(answerId) {
    return this.newdb.from('answers').where({ answer_id: answerId }).del();
  }

  deleteQuestion(questionId) {
    return this.newdb
      .from('questions')
      .where({ question_id: questionId })
      .del();
  }
}

module.exports = DataStore;
