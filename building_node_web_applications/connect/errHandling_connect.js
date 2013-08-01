var api = connect()
  .use(users)
  .use(pets)
  .use(errorHandler);
var app = connect()
  .use(hello)
  .use('/api', api)
  .use(errorPage)
  .listen(3000);

function hello(req, res, next) {
  if (req.url.match(/^\/hello/)) {
    res.end('Hello World\n');
  }
  else {
    next();
  }
}

var db = {
  users: [
    { name: 'tobi' },
    { name: 'loki' },
    { name: 'jane' }
  ]
};
function users(req, res, next) {
  var match = req.url.match(/^\/user\/(.+)/);
  if (match) {
    var user = db.users[match[1]];
    if (user) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(user));
    }
    else {
      var err = new Error('User not found');
      err.notFound = true;
      next(err);
    }
  }
  else {
    next();
  }
}
// Pets component. The undefined foo() function will trigger an exception, which will not have an err.notFound property //
function pets(req, res, next) {
  if (req.url.match(/^\/pet\/(.+)/)) {
    foo();
  }
  else {
    next();
  }
}
// A production-ready error-handling component that doesnt' expose too much information //
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.setHeader('Content-Type', 'application/json');
// This err-handling component uses the err.notFound property to distinguish between server errors and client errors //
  if (err.notFound) {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: err.message }));
  }
  else {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}
// Another approach would be to check whether the error is an 'instanceof' some other kind of error (such as a ValidationError from some validation module), and respond accordingly //

// Using the err.notFound property, if the server were to accept an HTTP request to, say, /user/ronald, which doesn't exist in your database, the users component would throw a notFound error, and when it got to the errorHandler component it would trigger the err.notFound code path, which returns a 404 status code along with the err.message property as a JSON object. //
