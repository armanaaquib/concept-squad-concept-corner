exports.seed = function (knex) {
  return knex('question_comments')
    .del()
    .then(function () {
      return knex('question_comments').insert([
        {
          username: 'bryce',
          question_id: 1,
          comment: 'provide sample data with your desired output',
          time: '2020-07-22 11:30:35',
        },
        {
          username: 'michel',
          question_id: 1,
          comment: 'provide sample data with your desired output',
          time: '2020-07-22 11:30:35',
        },
        {
          username: 'carlo',
          question_id: 6,
          comment:
            'the link that you have provided has nothing to do with my question ',
          time: '2020-07-22 11:30:35',
        },
        {
          username: 'bryce',
          question_id: 9,
          comment: 'Well 300 users (aggregated) disagree with you',
          time: '2020-07-22 11:30:35',
        },
        {
          username: 'michel',
          question_id: 4,
          comment: `Without seeing your COBOL code, I don't see where the FFFFF comes from. A move from a PIC S(9)V99 COMP-3 fields to a PIC 9(5) field should display 00020. Stack Overflow is a question and answer site, not a place where I can tutor you in the finer points of COBOL PICTURE coding. There are plenty of COBOL tutorials on the Internet.
            `,
          time: '2020-07-22 11:30:35',
        },
        {
          username: 'jake',
          question_id: 2,
          comment: `I agree with you. but the date in the field has been store as binary like I mentionned before as X'000000002000' which is not matching with the definition S9(9)v99 COMP-3. I am trying to find the proper way to extract this. So gymnastic needs to be done to achieve this
            `,
          time: '2020-07-22 11:30:35',
        },
        {
          username: 'bryce',
          question_id: 1,
          comment:
            'To determine how many days an order was placed on that day, all you have to do is add a sum via SQL for the same day',
          time: '2020-07-22 11:30:35',
        },
      ]);
    });
};
