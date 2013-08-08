var connect = require('connect');
var app = connect();
// logger widdleware component //
function logger(req, res, next) {
  console.log('%s %s', req.method, req.url);
  next();
}
//middleware componen that will send a response to the HTTP request //
function hello(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello world');
}
// A middleware component that performs HTTP Basic authentication //
function restrict(req, res, next) {
  var authorization = req.headers.authorization;
  if (!authorization) {
      return next(new Error('Unauthorized')); // the 'next' function is invoked with an Error object passed in as the argument. This notifies Connect that an application error has occured, which means that only error-handling middleware will be executed for the remainder of this HTTP request //
  }
  var parts = authorization.split(' ');
  var scheme = parts[0];
  var auth = new Buffer(parts[1], 'base64').toString().spli(':');
  var user = auth[0];
// A function that checks credentials against a database //
  authenticateWithDatabase(user, pass, function(err) {
    if (err) {
      return next(err); // Inform dispatcher that an error occured //
    }
    next(); // Call next()) with no arguments when given valid credentials //
  });
}

function admin(req, res, next) {
  switch(req.url) {
    case '/':
      res.end('try /users');
      break;
    case '/users':
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(['tobi', 'loki', 'jane']));
      break;
  }
}
// Error-handling middleware in Connect //
function errorHandler() {
  var env = process.env.NODE_ENV || 'development';
// Error-handling middleware defines four arguments //
  return function(err, req, res, next) {
    res.statusCode = 500;
// errorHandler behaves differently depending on value of NODE_ENV //
    switch (env) {
      case 'development':
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(err));
	break;
      default:
	res.end('Server error');
    }
  };
}

// Wrap multiple limit() middleware based on the Content-Type of the request //
function type(type, fn) { //fn in this case is one of the liimit() istances //
  return function(req, res, next) {
    var ct = req.headers['contect-type'] || '';
    if (0 != ct.indexOf(type)) { // the returned middleware first checks the content-type //
      return next();
    }
    fn(req, res, next); // before invoking the passed-in limit() middleware //
  }
}
var app = connect()
  .use(connect.favicon(__dirname + '/public/faicon.ico')) //manually specified custom .ico file. passing the file path as the only argument//
  .use(connect.logger())
  .use(connect.cookieParser('keyboard car'))
// session()) middleware requires signed cookies to function, so use cookieParser() above it and pass a secret //
  .use(connect.session())
  .use(function(req, res, next) {
    var sess = req.session;
    if (sess.views) {
      res.setHeader('Content-Type', 'text/html');
      res.write('<p>views: ' + sess.views + '</p>');
      res.end();
      sess.views++;
    }
    else {
      sess.views = 1;
      res.end('welcome to the session demo. refresh!');
    }
  });
  .use(type('application/x-www-form-urlencoded', connect.limit('64kb')))
  .use(type('application/json', connect.limit('32kb'))) //handles forms, json//
  .use(type('image', connect.limit('2mb'))) //image uploads up to 2 megabytes//
  .use(type('video', connect.limit('30mb'))) //video uploads up to 30 megabytes//
  .use(connect.bodyParser())
  .use(hello);

connect()
  .use(logger)
  .use('/admin', restrict)
 .use('/admin', admin)
  .use(hello)
  .listen(3000);
