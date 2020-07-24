const { env } = process;

const getDBFilePath = () => {
  const fileName = env.CONCEPT_CORNER_DB || 'concept-corner.db';
  return `./store/${fileName}`;
};
const getClientId = () => {
  const clientId = env.CLIENT_ID || '***REMOVED***';
  return clientId;
};

const getClientSecret = () => {
  let clientSecret = '***REMOVED***';
  clientSecret = env.CLIENT_SECRET || clientSecret;
  return clientSecret;
};

const getAuthLink = () => {
  let authLink = 'https://github.com/login/oauth/authorize?client_id=';
  authLink = env.AUTH_HREF || `${authLink}${getClientId()}`;
  return authLink;
};

module.exports = { getDBFilePath, getClientId, getClientSecret, getAuthLink};
