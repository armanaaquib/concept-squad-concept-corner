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
	profile_pic blob
);

CREATE TABLE questions (
	question_id integer PRIMARY KEY AUTOINCREMENT,
	username varchar,
	title text,
	time datetime,
	view_count integer,
	description blob,
	upvote integer,
	downvote integer,
	FOREIGN KEY(username) REFERENCES user_tbl(username)
);

CREATE TABLE tags (
	tag_id integer PRIMARY KEY AUTOINCREMENT,
	tagname varchar
);

CREATE TABLE answers (
	answer_id integer PRIMARY KEY AUTOINCREMENT,
	username varchar,
	question_id integer,
	answer blob,
	upvote integer,
	downvote integer,
	accepted boolean,
	thanks_count integer,
	time datetime,
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
	FOREIGN KEY(username) REFERENCES user_tbl(username),
	FOREIGN KEY(question_id) REFERENCES question_tbl(question_id)
);

CREATE TABLE question_tags (
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