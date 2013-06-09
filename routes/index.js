exports.index = function (req, res) {
  res.render('index', { title: 'RPGr', layout: 'layout' })
};
exports.getPartial = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};
