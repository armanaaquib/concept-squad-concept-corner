echo "running tests..."

npm test
testStatus=$?
npm run lint
lintStatus=$?

if [ $testStatus == 0 ] && [ $lintStatus == 0 ]; then
  echo "\n committing your code"
  exit 0
else
  echo "\n tests are failing..."
  exit 1
fi
