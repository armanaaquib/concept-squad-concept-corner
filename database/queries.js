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
        username 
      FROM 
        users 
      WHERE
        auth_login = ? and auth_source = ?;
  `,

  getQuestions: `
    SELECT 
      question_id, username, title, description,
      time, last_modified, view_count, no_of_answers, is_answer_accepted
    FROM 
      questions 
    ORDER BY 
      time DESC;
  `,

  getAnswers: `
    SELECT
      username, answer_id, answer, up_vote,
      down_vote, accepted, time, last_modified
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
    time, last_modified, view_count, no_of_answers
  FROM 
    questions
  WHERE question_id = ?;
`
};
