module.exports = {
  addQuestion: `
    INSERT INTO 
      questions(username, title, description, view_count)
    values(?, ?, ?, 0);
  `,

  addUser: `
      INSERT INTO 
        users( username, auth_login, auth_source, name, email, 
          location, title, about_me, company , profile_pic )
        values(?, ?, ?, ?, ?, ?, ?, ? ,? ,?);
  `,
  addAnswer: `
  INSERT INTO 
    answers( username, question_id, answer)
  values(?, ?, ?);
  `,

  updateAnswerCount: `
  UPDATE 
    questions 
  SET no_of_answers = no_of_answers + 1 
  WHERE 
    question_id = ?;
  `,

  getUser: `
      SELECT
        username, name, email, location, title, about_me, company, profile_pic 
      FROM 
        users 
      WHERE 
        username = ?;
  `,

  getRegisteredUser: `
      SELECT 
        username, profile_pic 
      FROM 
        users 
      WHERE
        auth_login = ? and auth_source = ?;
  `,

  getQuestions: `
    SELECT 
      que.question_id, que.username, que.title, que.description,
      que.time, que.last_modified, que.view_count, 
      que.no_of_answers, que.is_answer_accepted,
      usr.profile_pic
    FROM 
      questions as que join users as usr
    ON que.username = usr.username
    ORDER BY 
    time DESC;
  `,

  getAnswers: `
    SELECT
      username, answer_id, question_id, answer,
      accepted, time, last_modified
    FROM
      answers
    WHERE
      question_id = ?
    ORDER BY
      time ASC;
  `,

  getQuestion: `
  SELECT 
    question_id, username, title, description,
    time, last_modified, view_count, no_of_answers, is_answer_accepted
  FROM 
    questions
  WHERE question_id = ?;
`,

  acceptAnswer: `
  UPDATE 
    answers 
  SET
    accepted = 1
  WHERE
    answer_id = ?
  `,

  setAnswerAccepted: `
  UPDATE 
    questions
  SET
    is_answer_accepted = 1
  WHERE
    question_id = ?
  `,

  addTag: `
  INSERT INTO 
    tags(tag_name) 
    values(?);
  `,

  addQuestionTag: `
  INSERT INTO 
    question_tag(question_id, tag_id) 
    values(?, ?);
  `,

  getTags: `
    SELECT DISTINCT 
      * 
    FROM 
      tags;
  `,

  getTagId: `
  SELECT 
    tag_id 
  FROM 
    tags 
  WHERE 
    tag_name = ?;
  `,

  getQuestionTags: `
  SELECT 
    tags.tag_name 
  FROM 
    question_tag AS qt 
  JOIN tags ON qt.tag_id = tags.tag_id 
  WHERE 
    qt.question_id = ?;
  `,

  getVotesOfAnswer: `
  SELECT 
    vote, count(*) as vote_count
  FROM
    answer_votes
  WHERE
    answer_id = ?
  GROUP BY
    vote;
  `,

  getVote: `
  SELECT 
    vote
  FROM
    answer_votes
  WHERE
    username = ? and answer_id = ?;
  `,

  getTagSuggestion: `
  SELECT 
    tag_name 
  FROM 
    tags 
  WHERE 
    tag_name like ?;
  `,

  updateVote: `
  UPDATE
    answer_votes
  SET
    vote = ?
  WHERE
    username = ? AND answer_id = ?;
  `,

  addVote: `
  INSERT INTO
    answer_votes(username, answer_id, vote)
    values (?, ?, ?);
  `,

  deleteVote: `
  DELETE
  FROM
    answer_votes
  WHERE 
    username = ? AND answer_id = ?;
  `,

  getCommentsOfQuestion: `
  SELECT 
    comment, comment_id, time, username
  FROM 
    question_comments 
  WHERE
    question_id=?;
  `,

  addQuestionComment: `
  INSERT INTO 
    question_comments( username, question_id, comment )
    values(?, ?, ?);
  `,

  getComment: `
  SELECT 
    comment, comment_id, time, username
  FROM 
    question_comments 
  WHERE
    comment_id=?;`,

  updateQuestion: `
  UPDATE
    questions
  SET
    title = ?,
    description = ?,
    last_modified = (datetime('now', 'localtime'))
  WHERE
    question_id = ?;
  `,

  deleteQuestionTag: `
  DELETE
  FROM 
    question_tag
  WHERE
    question_id = ?;
  `,

  getCommentsOfAnswer: `
  SELECT 
    comment, comment_id, time, username
  FROM 
    answer_comments 
  WHERE
    answer_id = ?;
  `,

  addAnswerComment: `
  INSERT INTO 
    answer_comments( username, answer_id, comment )
    values(?, ?, ?);
  `,

  deleteQuestionComment: `
  DELETE
  FROM
    question_comments
  WHERE 
    comment_id = ?;`,

  deleteAnswer: `
  DELETE 
  FROM 
    answers 
  WHERE 
    answer_id = ?;
  `,
  deleteQuestion: `
  DELETE 
  FROM 
    questions 
  WHERE 
    question_id = ?;
  `
};
