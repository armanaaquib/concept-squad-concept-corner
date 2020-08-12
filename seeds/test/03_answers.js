exports.seed = function (knex) {
  return knex('answers')
    .del()
    .then(function () {
      return knex('answers').insert([
        {
          username: 'michel',
          question_id: 5,
          answer: 'Answer 1',
          accepted: 1,
          time: '2020-07-20 11:20:35',
        },
        {
          username: 'bryce',
          question_id: 5,
          answer: 'Answer 2',
          accepted: 0,
          time: '2020-07-21 11:20:35',
        },
        {
          username: 'jake',
          question_id: 5,
          answer: 'Answer 3',
          accepted: 0,
          time: '2020-07-21 12:20:35',
        },
        {
          username: 'michel',
          question_id: 2,
          answer: 'Answer 4',
          accepted: 0,
          time: '2020-07-22 11:20:35',
        },
        {
          username: 'carlo',
          question_id: 2,
          answer: 'Answer 5',
          accepted: 0,
          time: '2020-07-22 11:30:35',
        },
      ]);
    });
};
