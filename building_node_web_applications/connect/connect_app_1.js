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

connect()
  .use(logger)
  .use('/admin', restrict)
  .use('/admin', admin)
  .use(hello)
  .listen(3000);
