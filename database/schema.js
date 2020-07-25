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
	profile_pic varchar
);`,

  questions: `CREATE TABLE questions (
	question_id integer PRIMARY KEY AUTOINCREMENT,
	username varchar,
	title text,
	time datetime,
	view_count integer DEFAULT 0,
	description blob,
	no_of_answers integer DEFAULT 0,
	FOREIGN KEY(username) REFERENCES users(username)
);`,

  answers: `CREATE TABLE answers (
		answer_id integer PRIMARY KEY AUTOINCREMENT,
		username varchar,
		question_id integer,
		answer blob,
		up_vote integer,
		down_vote integer,
		accepted boolean,
		time datetime,
		FOREIGN KEY(username) REFERENCES user_tbl(username),
		FOREIGN KEY(question_id) REFERENCES question_tbl(question_id)
	);`,
};
