const { env } = process;

const getDBFileName = () => {
  return env.CONCEPT_CORNER_DB || 'concept-corner.db';
};

module.exports = { getDBFileName };
