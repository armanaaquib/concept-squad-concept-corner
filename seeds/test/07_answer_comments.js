exports.seed = function (knex) {
  return knex('answer_comments')
    .del()
    .then(function () {
      return knex('answer_comments').insert([
        {
          answer_id: 1,
          username: 'michel',
          comment: 'comment1',
          time: '2020-07-22 11:30:35',
        },
      ]);
    });
};
