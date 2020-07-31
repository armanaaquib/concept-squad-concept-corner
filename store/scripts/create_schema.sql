-- SQLite
CREATE TABLE users (
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
);

CREATE TABLE questions (
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
);

CREATE TABLE tags (
	tag_id integer PRIMARY KEY AUTOINCREMENT,
	tag_name varchar
);

CREATE TABLE answers (
	answer_id integer PRIMARY KEY AUTOINCREMENT,
	username varchar NOT NULL,
	question_id integer NOT NULL,
	answer blob NOT NULL,
	accepted boolean DEFAULT 0,
	time datetime DEFAULT (datetime('now', 'localtime')),
	last_modified datetime,
	FOREIGN KEY(username) REFERENCES user_tbl(username),
	FOREIGN KEY(question_id) REFERENCES question_tbl(question_id)
);

CREATE TABLE answer_comments (
	comment_id integer PRIMARY KEY AUTOINCREMENT,
	username varchar,
	answer_id integer,
	comment text,
	time datetime,
	FOREIGN KEY(username) REFERENCES user_tbl(username) FOREIGN KEY(answer_id) REFERENCES answer_tbl(answer_id)
);

CREATE TABLE question_comments (
	comment_id integer PRIMARY KEY AUTOINCREMENT,
	username varchar,
	question_id integer,
	comment text,
	time datetime,
	FOREIGN KEY(username) REFERENCES users(username),
	FOREIGN KEY(question_id) REFERENCES questions(question_id)
);

CREATE TABLE question_tag (
	question_id integer,
	tag_id integer,
	FOREIGN KEY(question_id) REFERENCES question_tbl(question_id),
	FOREIGN KEY(tag_id) REFERENCES tags(tag_id)
);

CREATE TABLE preferred_tags (
	username varchar,
	tag_id integer,
	FOREIGN KEY(username) REFERENCES user_tbl(username),
	FOREIGN KEY(tag_id) REFERENCES tags(tag_id)
);

CREATE TABLE answer_votes (
	username varchar,
	answer_id integer,
	vote varchar,
	FOREIGN KEY(username) REFERENCES users(username),
	FOREIGN KEY(answer_id) REFERENCES answers(answer_id)
);