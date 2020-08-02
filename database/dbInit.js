/*eslint-disable no-unused-vars */

const { getDBFilePath } = require('../config');
const throwError = (err) => {
  if (err) {
    throw err;
  }
};

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
  'auth_source': {
    type: DataTypes.STRING,
  },
  'auth_login': {
    type: DataTypes.STRING
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING
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
  about_me: {
    type: DataTypes.STRING
  },
  profile_pic: {
    type: DataTypes.STRING
  }
}, {timestamps: false});

const Questions = conceptCornerDb.define('questions', {
  question_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }, 
  description: {
    type: DataTypes.STRING
  },
  username: {
    type: DataTypes.STRING,
    references: {
      model: Users,
      key: 'username'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_answer_accepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  no_of_answers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {updatedAt: false});

const Answers = conceptCornerDb.define('answers', {
  answer_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }, 
  answer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  question_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Questions,
      key: 'question_id'
    }
  },
  username: {
    type: DataTypes.STRING,
    references: {
      model: Users,
      key: 'username'
    }
  },
  accepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {updatedAt: false});

const Tags = conceptCornerDb.define('tags', {
  tag_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }, 
  tag_name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {timestamps: false});

const question_tag = conceptCornerDb.define('question_tag', {
  tag_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Tags,
      key: 'tag_id'
    }
  }, 
  question_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Questions,
      key: 'question_id'
    }
  }, 
}, {updatedAt: false});

const QuestionComments = conceptCornerDb.define('question_comments', {
  comment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }, 
  question_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Questions,
      key: 'question_id'
    }
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    references: {
      model: Users,
      key: 'username'
    }
  }
}, {updatedAt: false});

const Answer_comments = conceptCornerDb.define('answer_comments', {
  comment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }, 
  answer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Answers,
      key: 'answer_id'
    }
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false
  }, 
  username: {
    type: DataTypes.STRING,
    references: {
      model: Users,
      key: 'username'
    }
  }
}, {updatedAt: false});

const Answer_votes = conceptCornerDb.define('answer_votes', {
  answer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Answers,
      key: 'answer_id'
    }
  },
  vote: {
    type: DataTypes.STRING,
    allowNull: false
  }, 
  username: {
    type: DataTypes.STRING,
    references: {
      model: Users,
      key: 'username'
    }
  }
}, {timestamps: false}); 

const createTables = async function(){
  await conceptCornerDb.sync({force: true});
  await Users.bulkCreate([{
    username: 'aas', 
    name: 'michal shwan', 
    title: 'developer', 
    auth_login: 'michal', 
    auth_source: 'github'
  //}, {
  //username: 'bryce12', 
  //name: 'bryce shwan', 
  //title: 'developer', 
  //auth_login: 'bryce12', 
  //auth_source: 'github'
  //
  }]);
};

const getUser = async function(key){
  const user = await Users.findOne(
    {attributes:
    ['username', 'name', 'email'],
    where: {
      username: {
        [Op.eq]: key
      }
    }
    }, );
  return user.toJSON();
};
const getRegisteredUser = async function (authSource, authLogin) {
  const registeredUser = await Users.findOne(
    {attributes: ['name', 'username', 'email'], where: {
      [Op.and]: {
        auth_login: authLogin,
        auth_source: authSource
      }
    }},);
  return registeredUser.toJSON();
};

const main = async function() {
  await createTables();
  const user = await getUser('michel');
  await getRegisteredUser('github', 'michel');
  await getRegisteredUser('github', 'bryce');
};

main();
