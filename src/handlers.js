const addUser = (req, res) => {
  const { users } = req.app.locals;
  const userDetail = req.body;
  users.add(userDetail).then(() => res.end());
};

const getUser = (req, res) => {
  const { users } = req.app.locals;
  const { username } = req.body;
  users.get(username).then((user) => res.end(JSON.stringify(user)));
};

module.exports = { addUser, getUser };
