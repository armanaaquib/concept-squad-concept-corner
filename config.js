require('dotenv').config({path: __dirname + '/.env'});
const { env } = process;

const getDBFilePath = () => {
  const fileName = env.CONCEPT_CORNER_DB;
  return `./store/${fileName}`;
};

const getClientId = () => {
  const clientId = env.DB_CLIENT_ID;
  return clientId;
};

const getDBClient = () => {
  const client = env.DB_CLIENT;
  return client;
};

const getClientSecret = () => {
  const clientSecret = env.CLIENT_SECRET;
  return clientSecret;
};

const getAuthLink = () => {
  let authLink = 'https://github.com/login/oauth/authorize?client_id=';
  authLink = env.AUTH_HREF || `${authLink}${getClientId()}`;
  return authLink;
};

module.exports = {
  getDBFilePath,
  getClientId,
  getClientSecret,
  getAuthLink,
  getDBClient
};
