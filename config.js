const { env } = process;

const getDBFilePath = () => {
  const fileName = env.CONCEPT_CORNER_DB || 'concept-corner.db';
  return `./store/${fileName}`;
};

module.exports = { getDBFilePath };
