exports.seed = function (knex) {
  return knex('answer_comments')
    .del()
    .then(function () {
      return knex('answer_comments').insert([
        {
          username: 'bryce',
          answer_id: 1,
          comment: 'this is exactly what I was searching for thanks a lot',
          time: '2020-07-22 11:30:35',
        },
        {
          username: 'jake',
          answer_id: 1,
          comment: `Out of curiosity, could someone explain why the initialisation expression in the 3rd line can't be used by itself (e.g. passed into a method) or be assigned to a var variable?
            `,
          time: '2020-07-22 11:30:35',
        },
        {
          username: 'carlo',
          answer_id: 1,
          comment:
            'Interesting question. It would make sense that var x = {} does not work if the array initializer could yield anything else than arrays, but I would not know what that is. So I guess the array initializer is a language feature. If you use it with new List<string> {"A", "B"}it yields something different, too',
          time: '2020-07-22 11:30:35',
        },

        {
          username: 'michel',
          answer_id: 1,
          comment:
            ' You have two horses. You wish to know which is faster. Do you (1) race the horses, or (2) ask a stranger on the internet who has never seen the horses which one he thinks is faster? Race your horses. You want to know which one is more "efficient"? First create a measurable standard for efficiency; remember, efficiency is value produced per unit cost, so define your value and cost carefully. Then write the code both ways and measure its efficiency. Use science to answer scientific questions, not asking random strangers for guesses',
          time: '2020-07-22 11:30:35',
        },
      ]);
    });
};
