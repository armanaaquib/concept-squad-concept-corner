class Users {
  constructor(db) {
    this.db = db;
  }

  add(user) {
    const sql = `INSERT INTO users(username, name, email)
    values(?, ?, ?)`;

    return new Promise((resolve, reject) => {
      this.db.run(sql, [user.username, user.name, user.email], (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }

  get(username) {
    const sql = 'SELECT username, name, email FROM users WHERE username = ?';

    return new Promise((resolve, reject) => {
      this.db.get(sql, [username], (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      });
    });
  }
}

module.exports = Users;
