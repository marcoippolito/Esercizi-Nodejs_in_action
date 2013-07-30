var http = require('http');
var counter = 0;
var server = http.createServer(function(req, res) {
  counter++;
  res.write('I have benn accessed ' + counter + ' times.');
  res.end();
});
server.listen(8888);
