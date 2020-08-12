exports.seed = function (knex) {
  return knex('questions')
    .del()
    .then(function () {
      return knex('questions').insert([
        {
          username: 'michel',
          title: 'Question Title 1',
          description: 'Description 1',
          view_count: 10,
          is_answer_accepted: 0,
          time: '2020-07-20 11:20:35',
        },
        {
          username: 'michel',
          title: 'Question 2',
          description: 'Description 2',
          view_count: 9,
          is_answer_accepted: 0,
          time: '2020-07-20 11:24:35',
        },
        {
          username: 'jake',
          title: 'Question 3',
          description: null,
          view_count: 5,
          is_answer_accepted: 0,
          time: '2020-07-21 11:15:35',
        },
        {
          username: 'jake',
          title: 'Question 4',
          description: 'Description 4',
          view_count: 7,
          is_answer_accepted: 0,
          time: '2020-07-21 11:20:35',
        },
        {
          username: 'carlo',
          title: 'Question 5',
          description: 'Description 5',
          view_count: 9,
          is_answer_accepted: 1,
          time: '2020-07-21 11:24:35',
        },
      ]);
    });
};
