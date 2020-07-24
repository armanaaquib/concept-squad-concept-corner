module.exports = {
  addQuestion: `INSERT INTO 
  questions(username, title, description, time)
  values(?, ?, ?, strftime('%s', 'now'))
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
      values(?, ?, ?, ?, ?, ?, ?, ? ,? ,?)`
};
