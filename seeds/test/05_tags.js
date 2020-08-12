exports.seed = function (knex) {
  return knex('tags')
    .del()
    .then(function () {
      return knex('tags').insert([
        { tag_name: 'java' },
        { tag_name: 'nav' },
        { tag_name: 'node' },
      ]);
    });
};
