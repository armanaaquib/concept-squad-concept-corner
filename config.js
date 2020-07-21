const { env } = process;

const getDB = () => {
  return env.CONCEPT_CORNER_DB || 'concept-corner.db';
};

module.exports = { getDB };
