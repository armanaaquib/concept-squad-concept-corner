-- -- SQLite
insert into
  users(
    username,
    name,
    auth_login,
    auth_source,
    email,
    location,
    title,
    about_me,
    company,
    profile_pic
  )
VALUES
  (
    'michel',
    'michel shawn',
    'michel',
    'github',
    'michel@gmail.com',
    'new york',
    'developer',
    'java developer worked for 20 years across different companies',
    'apple',
    null
  ),
  (
    'bryce',
    'bryce shawn',
    'bryce',
    'github',
    'bryce@gmail.com',
    'new delhi',
    'consultant',
    '.Net developer worked for 10 years',
    'microsoft',
    null
  ),
  (
    'jake',
    'jake shawn',
    'jake',
    'github',
    'jake@gmail.com',
    'london',
    'project manager',
    null,
    null,
    null
  ),
  (
    'carlo',
    'carlo shawn',
    'carlo',
    'github',
    'carlo@gmail.com',
    'california',
    null,
    null,
    'amd',
    null
  );

--insert question
insert into
  questions(
    username,
    title,
    description,
    view_count,
    is_answer_accepted,
    time
  )
VALUES
  (
    'michel',
    'Question Title 1',
    'Description 1',
    10,
    0,
    '2020-07-20 11:20:35'
  ),
  (
    'michel',
    'Question 2',
    'Description 2',
    9,
    0,
    '2020-07-20 11:24:35'  
  ),
  (
    'jake',
    'Question 3',
    NULL,
    5,
    0,
    '2020-07-21 11:15:35'
  ),
  (
    'jake',
    'Question 4',
    'Description 4',
    7,
    0,
    '2020-07-21 11:20:35'
  ),
  (
    'carlo',
    'Question 5',
    'Description 5',
    9,
    1,
    '2020-07-21 11:24:35'
  );

--insert answers
  insert into
  answers(
    username,
    question_id,
    answer,
    accepted,
    time
  )
VALUES
  (
    'michel',
    5,
    'Answer 1',
    1,
     '2020-07-20 11:20:35'
  ),
  (
    'bryce',
    5,
    'Answer 2',
    0,
    '2020-07-21 11:20:35'
  ),
  (
    'jake',
    5,
    'Answer 3',
    0,
     '2020-07-21 12:20:35'
  ),
  (
    'michel',
    2,
    'Answer 4',
    0,
    '2020-07-22 11:20:35'
  ),
  (
    'carlo',
    2,
    'Answer 5',
    0,
     '2020-07-22 11:30:35'
  );

 UPDATE
    questions
  SET 
    no_of_answers = 3
  WHERE
    question_id = 5;

  UPDATE
    questions
  SET 
    no_of_answers = 2
  WHERE
    question_id = 2;


INSERT INTO
  answer_votes(username, answer_id, vote)
VALUES
  ('michel', 1, 'up'),
  ('jake', 1, 'up'),
  ('bryce', 1, 'down'),
  ('michel', 5, 'down'),
  ('jake', 5, 'up'),
  ('bryce', 5, 'up'),
  ('michel', 6, 'down'),
  ('jake', 6, 'up'),
  ('bryce', 6, 'up');
  
INSERT INTO tags (tag_name) VALUES ('java'),('nav'),('node');

INSERT INTO question_comments (question_id, username, comment, time) VALUES(1, 'michel','comment1','2020-07-22 11:30:35');
INSERT INTO answer_comments (answer_id, username, comment, time) VALUES(1, 'michel','comment1','2020-07-22 11:30:35');
