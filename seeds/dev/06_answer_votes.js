exports.seed = function (knex) {
  return knex('answer_votes')
    .del()
    .then(function () {
      return knex('answer_votes').insert([
        { username: 'neha', answer_id: 1, vote: 'up' },
        { username: 'armanaaquib', answer_id: 1, vote: 'up' },
        { username: 'jake', answer_id: 1, vote: 'up' },
        { username: 'bryce', answer_id: 1, vote: 'down' },
        { username: 'neha', answer_id: 2, vote: 'down' },
        { username: 'armanaaquib', answer_id: 2, vote: 'down' },
        { username: 'neha', answer_id: 5, vote: 'down' },
        { username: 'jake', answer_id: 5, vote: 'up' },
        { username: 'bryce', answer_id: 5, vote: 'up' },
        { username: 'neha', answer_id: 6, vote: 'down' },
        { username: 'jake', answer_id: 6, vote: 'up' },
        { username: 'bryce', answer_id: 6, vote: 'up' },
      ]);
    });
};
