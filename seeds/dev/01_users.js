exports.seed = function (knex) {
  return knex('users')
    .del()
    .then(function () {
      return knex('users').insert([
        {
          username: 'armanaaquib',
          name: 'Aaquib Equbal',
          auth_login: 'armanaaquib',
          auth_source: 'github',
          email: 'armanaaquibequbal@gmail.com',
          location: 'new york',
          title: 'developer',
          about_me:
            'java developer worked for 20 years across different companies',
          company: 'apple',
          profile_pic: null,
        },
        {
          username: 'neha',
          name: 'Neha-sanserwal',
          auth_login: 'Neha-sanserwal',
          auth_source: 'github',
          email: 'neha16sanserwal@gmail.com',
          location: 'new york',
          title: 'developer',
          about_me:
            'java developer worked for 20 years across different companies',
          company: 'apple',
          profile_pic: null,
        },
        {
          username: 'michel',
          name: 'michel shawn',
          auth_login: 'michel',
          auth_source: 'github',
          email: 'michel@gmail.com',
          location: 'new york',
          title: 'developer',
          about_me:
            'java developer worked for 20 years across different companies',
          company: 'apple',
          profile_pic: null,
        },
        {
          username: 'bryce',
          name: 'bryce shawn',
          auth_login: 'bryce',
          auth_source: 'github',
          email: 'bryce@gmail.com',
          location: 'new delhi',
          title: 'consultant',
          about_me: '.Net developer worked for 10 years',
          company: 'microsoft',
          profile_pic: null,
        },
        {
          username: 'jake',
          name: 'jake shawn',
          auth_login: 'jake',
          auth_source: 'github',
          email: 'jake@gmail.com',
          location: 'london',
          title: 'project manager',
          about_me: null,
          company: null,
          profile_pic: null,
        },
        {
          username: 'carlo',
          name: 'carlo shawn',
          auth_login: 'carlo',
          auth_source: 'github',
          email: 'carlo@gmail.com',
          location: 'california',
          title: null,
          about_me: null,
          company: 'amd',
          profile_pic: null,
        },
      ]);
    });
};
