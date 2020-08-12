exports.seed = function (knex) {
  return knex('tags')
    .del()
    .then(function () {
      return knex('tags').insert([
        { tag_name: 'nodejs' },
        { tag_name: 'java' },
        { tag_name: 'c' },
        { tag_name: 'C#' },
        { tag_name: 'js' },
        { tag_name: 'clojure' },
      ]);
    });
};
