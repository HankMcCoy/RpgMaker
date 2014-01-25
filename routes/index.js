exports.index = function (req, res) {
  res.render('index', { title: 'RPGr', layout: 'layout' })
};

exports.sheetEditor = function (req, res) {
  res.render('sheetEditor', { title: 'RPGr - New sheet', layout: 'layout' });
};

exports.getPartial = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};
