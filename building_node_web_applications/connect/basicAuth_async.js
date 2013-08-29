var app = connect();

app.use(connect.basicAuth(function(user, pass, callback) {
// User.authenticate could be a database validation function //
  User.authenticate({ user: user, pass: pass }, gotUser);
//Invoked asynchronously when the database has responded//
  function gotUSer(err, user) {
    if (err) return callback(err);
// Provide the basicAuth callback with the 'user' object from the database //
  }
}));
