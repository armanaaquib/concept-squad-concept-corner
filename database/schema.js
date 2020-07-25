module.exports = {
  users: `CREATE TABLE users (
	username varchar PRIMARY KEY,
	auth_login varchar,
	auth_source varchar,
	name varchar,
	email varchar,
	location varchar,
	title varchar,
	about_me varchar,
	company varchar,
	profile_pic blob
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
