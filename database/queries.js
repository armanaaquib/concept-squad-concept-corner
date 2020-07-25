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
        auth_login, auth_source, username 
      FROM 
        users 
      WHERE
        auth_login = ? and auth_source = ?;
  `,

  getQuestions: `
    SELECT 
      question_id, username, title, description, time, view_count
    FROM 
      questions 
    ORDER BY 
      time DESC;
  `,

  getAnswers: `
    SELECT
      username, answer_id, answer, up_vote, down_vote, accepted, time
    FROM
      answers
    WHERE
      question_id = ?
    ORDER BY
      time ASC;
  `,

  getQuestion: `
  SELECT 
    question_id, username, title, description, time, view_count
  FROM 
    questions
  WHERE question_id = ?;
`,
};
