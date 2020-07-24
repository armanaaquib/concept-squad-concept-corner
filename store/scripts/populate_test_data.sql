-- -- SQLite
insert into
  users(
    username,
    name,
    email,
    location,
    title,
    aboutMe,
    company,
    profilePic
  )
VALUES
  (
    'michel',
    'michel shawn',
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
    time
  )
VALUES
  (
    'michel',
    'Question Title 1',
    'Description 1',
    10,
    '2020-07-20 11:20:35'
  ),
  (
    'michel',
    'Question 2',
    'Description 2',
    9,
    '2020-07-20 11:24:35'  
  ),
  (
    'jake',
    'Question 3',
    NULL,
    5,
    '2020-07-21 11:15:35'
  ),
  (
    'jake',
    'Question 4',
    'Description 4',
    7,
    '2020-07-21 11:20:35'
  ),
  (
    'carlo',
    'Question 5',
    'Description 5',
    9,
    '2020-07-21 11:24:35'
  )