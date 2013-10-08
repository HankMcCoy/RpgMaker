
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  apiRoutes = require('./routes/api');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { doctype: 'html', layout: false });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/views/partials/:name', routes.getPartial);

app.get('/api/systems/:systemId', apiRoutes.getSystem);
app.get('/api/systems', apiRoutes.getSystems);
app.delete('/api/systems/:systemId', apiRoutes.deleteSystem);
app.post('/api/systems', apiRoutes.createSystem);
app.put('/api/systems', apiRoutes.updateSystem);

app.get('/api/sheets/:sheetId', apiRoutes.getSheet);
app.get('/api/sheets', apiRoutes.getSheets);
app.delete('/api/sheets/:sheetId', apiRoutes.deleteSheet);
app.post('/api/sheets', apiRoutes.createSheet);
app.put('/api/sheets', apiRoutes.updateSheet);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

