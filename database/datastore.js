class DataStore {
  constructor(db) {
    this.db = db;
  }

  addUser(user) {
    const sql = `
    INSERT INTO 
      users(username, name, email, location, title, aboutMe, company)
      values(?, ?, ?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      this.db.run(
        sql,
        [
          user.username,
          user.name,
          user.email,
          user.location,
          user.title,
          user.aboutMe,
          user.company,
        ],
        (err) => {
          if (err) {
            reject(err);
          }
          resolve(true);
        }
      );
    });
  }

  getUser(username) {
    const sql = `
    SELECT
      username,
      name,
      email,
      location,
      title,
      aboutMe,
      company,
      profilePic 
    FROM 
      users 
    WHERE 
      username = ?
    `;

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

module.exports = DataStore;
