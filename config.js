const { env } = process;
const dotenv = require('dotenv');

dotenv.config();

const getDBFilePath = () => {
  const fileName = env.CONCEPT_CORNER_DB || 'concept-corner.db';
  return `./store/${fileName}`;
};

const getClientId = () => {
  const clientId = env.CLIENT_ID;
  return clientId;
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

const getSessionSecretKey = () => {
  return env.CONCEPT_SECRET_KEY;
};

module.exports = {
  getDBFilePath,
  getClientId,
  getClientSecret,
  getAuthLink,
  getSessionSecretKey
};
