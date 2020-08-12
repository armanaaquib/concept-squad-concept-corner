exports.seed = function (knex) {
  return knex('question_comments')
    .del()
    .then(function () {
      return knex('question_comments').insert([
        {
          question_id: 1,
          username: 'michel',
          comment: 'comment1',
          time: '2020-07-22 11:30:35',
        },
      ]);
    });
};
