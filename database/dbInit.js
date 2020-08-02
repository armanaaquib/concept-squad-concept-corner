//const sqlite = require('sqlite3').verbose();
const { getDBFilePath } = require('../config');

//const schema = require('./schema');

const throwError = (err) => {
  if (err) {
    throw err;
  }
};

//const createTables = () => {
//const db = new sqlite.Database(getDBFilePath(), throwError);
//db.run(schema.users, throwError);
//db.run(schema.questions, throwError);
//db.run(schema.answers, throwError);
//db.run(schema.tags, throwError);
//db.run(schema.question_tag, throwError);
//db.run(schema.question_comments, throwError);
//db.close(throwError);
//};

//createTables();
const { Sequelize, DataTypes, Op} = require('sequelize');
const conceptCornerDb = new Sequelize({
  dialect: 'sqlite',
  logging: false,
  storage: getDBFilePath()
});
conceptCornerDb.authenticate().catch(throwError);
const Users = conceptCornerDb.define('users', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true
  },
  authProvider: {
    type: DataTypes.STRING,
  },
  authLogin: {
    type: DataTypes.STRING
  },
  name: {
    type: DataTypes.STRING,
    unique: true
  },
  emailId: {
    type: DataTypes.STRING,
    unique: true
  },
  title: {
    type: DataTypes.STRING
  },
  company: {
    type: DataTypes.STRING
  },
  location: {
    type: DataTypes.STRING
  },
  aboutMe: {
    type: DataTypes.STRING
  }
}, {timestamps: false});
const createTables = async function(){
  await conceptCornerDb.sync({force: true});
  await Users.bulkCreate([{
    username: 'michal', name: 'michel shwan', title: 'developer', authLogin: 'michal', authProvider: 'github'
  }, {
    username: 'bryce', name: 'bryce shwan', title: 'developer', authLogin: 'bryce12', authProvider: 'github'
  }]);
};

const userDml = async function(){
  const users = await Users.findAll();
  users.forEach((user) => {
    console.log(user.toJSON());
  });
};

const getUser = async function(key){
  const user = await Users.findOne(
    {attributes:
    ['username', 'name', 'emailId'],
    where: {
      username: {
        [Op.eq]: key
      }
    }
    }, );
  return user.toJSON();
};
const getRegisteredUser = async function (authProvider, authLogin) {
  const registeredUser = await Users.findOne(
    {attributes: ['name', 'username', 'emailId'], where: {
      [Op.and]: {
        authLogin: authLogin,
        authProvider: authProvider
      }
    }},);
  return registeredUser.toJSON();
};
const main = async function() {
  await createTables();
  await userDml();
  console.log(await getUser('michal'));
  console.log(await getRegisteredUser('github', 'michal'));
  console.log(await getRegisteredUser('github', 'bryce12'));
  
};

main();
