module.exports = {
  addQuestion: `INSERT INTO 
  questions(username, title, description, view_count, time)
  values(?, ?, ?, 0, datetime('now'))
  `,

  addUser: `INSERT INTO 
      users(
        username,
        authLogin,
        authSource, 
        name, 
        email, 
        location,
        title,
        aboutMe,
        company ,
        profilePic )
      values(?, ?, ?, ?, ?, ?, ?, ? ,? ,?)`,

  getQuestions: `
  SELECT question_id, username, title, description, time, view_count
  FROM
    questions
  ORDER BY
    time DESC
  `,
};
