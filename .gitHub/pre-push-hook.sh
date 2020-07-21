echo "running tests"

npm test
testStatus=$?
npm run lint
lintStatus=$?

if [ $testStatus == 0 ] && [ $lintStatus == 0 ]; then
  echo "\n pushing code"
  exit 0
else
  echo "\n error detected ..."
  exit 1
fi
