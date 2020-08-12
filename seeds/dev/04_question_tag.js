exports.seed = function (knex) {
  return knex('question_tag')
    .del()
    .then(function () {
      return knex('question_tag').insert([
        { question_id: 1, tag_id: 1 },
        { question_id: 1, tag_id: 3 },
        { question_id: 2, tag_id: 2 },
        { question_id: 2, tag_id: 4 },
        { question_id: 3, tag_id: 5 },
        { question_id: 3, tag_id: 4 },
        { question_id: 4, tag_id: 4 },
        { question_id: 4, tag_id: 1 },
        { question_id: 5, tag_id: 2 },
        { question_id: 5, tag_id: 6 },
        { question_id: 5, tag_id: 3 },
        { question_id: 6, tag_id: 5 },
        { question_id: 6, tag_id: 3 },
        { question_id: 6, tag_id: 6 },
        { question_id: 6, tag_id: 2 },
        { question_id: 1, tag_id: 5 },
      ]);
    });
};
