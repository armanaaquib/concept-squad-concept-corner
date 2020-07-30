module.exports = {
  addQuestion: `
    INSERT INTO 
      questions(username, title, description, view_count, time)
    values(?, ?, ?, 0, datetime('now'));
  `,

  addUser: `
      INSERT INTO 
        users( username, auth_login, auth_source, name, email, 
          location, title, about_me, company , profile_pic )
        values(?, ?, ?, ?, ?, ?, ?, ? ,? ,?);
  `,
  addAnswer: `
  INSERT INTO 
  answers( username, question_id, answer, time )
  values(?, ?, ?,datetime('now'));
  `,
  updateAnswerCount: `
      update questions set no_of_answers=no_of_answers+1 where question_id = ?;
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
  insert into tags(tag_name) values(?);
  `,
  addQuestionTag: `
  insert into question_tag(question_id,tag_id) values(?,?);
  `,
  getTags: `
    select distinct * from tags;
  `,
  getTagId: `
   select tag_id from tags where tag_name = ?;
  `,
  getQuestionTags: `
    select tags.tag_name from question_tag as qt 
    join tags on qt.tag_id=tags.tag_id where qt.question_id = ?;
  `,
  getVotesOfAnswer: `
  SELECT 
    vote, count(*) as vote_count
  WHERE
    answer_id = ?
  GROUP BY
    vote
  `,
};
