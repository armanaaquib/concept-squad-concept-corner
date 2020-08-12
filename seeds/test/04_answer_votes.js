exports.seed = function (knex) {
  return knex('answer_votes')
    .del()
    .then(function () {
      return knex('answer_votes').insert([
        { username: 'michel', answer_id: 1, vote: 'up' },
        { username: 'jake', answer_id: 1, vote: 'up' },
        { username: 'bryce', answer_id: 1, vote: 'down' },
        { username: 'michel', answer_id: 5, vote: 'down' },
        { username: 'jake', answer_id: 5, vote: 'up' },
        { username: 'bryce', answer_id: 5, vote: 'up' },
        { username: 'jake', answer_id: 3, vote: 'up' },
        { username: 'bryce', answer_id: 3, vote: 'up' },
      ]);
    });
};
