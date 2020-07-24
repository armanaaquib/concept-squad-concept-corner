module.exports = {
  users: `CREATE TABLE users (
	username varchar PRIMARY KEY,
	authLogin varchar,
	authSource varchar,
	name varchar,
	email varchar,
	location varchar,
	title varchar,
	aboutMe varchar,
	company varchar,
	profilePic blob
);`,
  questions: `CREATE TABLE questions (
	question_id integer PRIMARY KEY AUTOINCREMENT,
	username varchar,
	title text,
	time datetime,
	view_count integer DEFAULT 0,
	description blob,
	FOREIGN KEY(username) REFERENCES users(username)
);`
};
