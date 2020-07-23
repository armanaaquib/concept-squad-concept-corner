module.exports = {
  users: `CREATE TABLE users (
	username varchar PRIMARY KEY,
	name varchar,
	email varchar,
	location varchar,
	title varchar,
	aboutMe varchar,
	company varchar,
	profilePic blob
)`,
  githubUsers: `CREATE TABLE githubUsers (
	authId INTEGER PRIMARY KEY,
		username varchar,
	FOREIGN KEY (username) REFERENCES users(username)
)`,
  questions: `CREATE TABLE questions (
	question_id integer PRIMARY KEY AUTOINCREMENT,
	username varchar,
	title text,
	time datetime,
	view_count integer DEFAULT 0,
	description blob,
	FOREIGN KEY(username) REFERENCES users(username)
)`
};
