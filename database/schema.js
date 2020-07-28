module.exports = {
  users: `CREATE TABLE users (
	username varchar PRIMARY KEY,
	auth_login varchar NOT NULL,
	auth_source varchar NOT NULL,
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
	username varchar NOT NULL,
	title text NOT NULL,
	time datetime DEFAULT (datetime('now', 'localtime')),
	last_modified datetime,
	view_count integer DEFAULT 0,
	description blob,
	no_of_answers integer DEFAULT 0,
	FOREIGN KEY(username) REFERENCES users(username)
);`,

  answers: `CREATE TABLE answers (
		answer_id integer PRIMARY KEY AUTOINCREMENT,
		username varchar NOT NULL,
		question_id integer NOT NULL,
		answer blob NOT NULL,
		up_vote integer DEFAULT 0,
		down_vote integer DEFAULT 0,
		accepted boolean DEFAULT 0,
		time datetime DEFAULT (datetime('now', 'localtime')),
		last_modified datetime,
		FOREIGN KEY(username) REFERENCES user_tbl(username),
		FOREIGN KEY(question_id) REFERENCES question_tbl(question_id)
	);`,
};
