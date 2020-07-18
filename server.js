const app = require('./src/app');
const { env, stdout } = process;

const main = () => {
  const PORT = env.PORT || 8000;
  app.listen(PORT, () => stdout.write(`Listening at ${PORT}\n`));
};

main();
