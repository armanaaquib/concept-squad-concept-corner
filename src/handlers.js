const loadHomePage = function(req, res, next){
  res.render('home', {});
  res.end();
};
module.exports = {loadHomePage};
