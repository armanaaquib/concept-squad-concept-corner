module.exports = {
  addQuestion: `INSERT INTO 
  questions(username, title, description, time)
  values(?, ?, ?, strftime('%s', 'now'))
  `
};
