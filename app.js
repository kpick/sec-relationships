/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

//Routes

app.get('/', routes.site.index);

app.get('/users', routes.users.list);
app.post('/users', routes.users.create);
app.get('/users/:id', routes.users.show);
app.post('/users/:id', routes.users.edit);
app.del('/users/:id', routes.users.del);

app.post('/users/:id/follow', routes.users.follow);
app.post('/users/:id/unfollow', routes.users.unfollow);

app.get('/hosts', routes.hosts.list);
app.post('/hosts', routes.hosts.create);
app.get('/hosts/:id', routes.hosts.show);
app.post('/hosts/:id', routes.hosts.edit);
app.del('/hosts/:id', routes.hosts.del);

app.post('/hosts/:id/connect', routes.hosts.connect);
app.post('/hosts/:id/disconnect', routes.hosts.disconnect);


app.get('/graph', routes.graph.view);
app.get('/graph/test', routes.graph.test);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening at: http://localhost:%d/', app.get('port'));
});