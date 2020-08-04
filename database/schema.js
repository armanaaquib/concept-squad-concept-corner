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
	is_answer_accepted bool DEFAULT 0,
	no_of_answers integer DEFAULT 0,
	FOREIGN KEY(username) REFERENCES users(username)
);`,

  answers: `CREATE TABLE answers (
		answer_id integer PRIMARY KEY AUTOINCREMENT,
		username varchar NOT NULL,
		question_id integer NOT NULL,
		answer blob NOT NULL,
		accepted boolean DEFAULT 0,
		time datetime DEFAULT (datetime('now', 'localtime')),
		last_modified datetime,
		FOREIGN KEY(username) REFERENCES users(username),
		FOREIGN KEY(question_id) REFERENCES questions(question_id)
	);`,

  tags: `CREATE TABLE tags(
		tag_id integer PRIMARY KEY AUTOINCREMENT,
		tag_name varchar NOT NULL
	)
	`,
  question_tag: `create table question_tag(
		question_id integer,
		tag_id integer,
		FOREIGN KEY(tag_id) REFERENCES tags(tag_id),
		FOREIGN KEY(question_id) REFERENCES questions(question_id)
	)`,
  answer_votes: `CREATE TABLE answer_votes (
		usrename varchar,
		answer_id integer,
		vote varchar,
		FOREIGN KEY(username) REFERENCES users(username),
		FOREIGN KEY(answer_id) REFERENCES answers(answer_id)
	);`,

  question_comments: `CREATE TABLE question_comments (
		comment_id integer PRIMARY KEY AUTOINCREMENT,
		username varchar,
		question_id integer,
		comment text,
		time datetime DEFAULT (datetime('now', 'localtime')),
		FOREIGN KEY(username) REFERENCES users(username),
		FOREIGN KEY(question_id) REFERENCES questions(question_id)
	);`,
  answer_comments: `CREATE TABLE answer_comments (
		comment_id integer PRIMARY KEY AUTOINCREMENT,
		username varchar,
		answer_id integer,
		comment text,
		time datetime DEFAULT (datetime('now', 'localtime')),
		FOREIGN KEY(username) REFERENCES users(username),
		FOREIGN KEY(answer_id) REFERENCES answers(answer_id)
	);`
};
