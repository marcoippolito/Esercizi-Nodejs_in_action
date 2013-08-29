var express = require('express');
var app = express();

// Respond to any web request to / //
app.get('/', function(req, res) {
// Send "Hello" as response text //
  res.send('Hello');
});
// Listen on port 3000 //
app.listen(3000);
