var http = require('http');
var url = require('url');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');
// SSL key and cert given as options. //
var options = {
  key: fs.readFileSync('./key.pem');
  cert: fs.readFileSync('./key-cert.pem');
};

var formidable = require('formidable');
var root = __dirname;
// The data store is a regular JavaScript Array in memory. //
var items = [];
// options object is passed first //
// https and http modules have almost identical APIs //
var server = http.createServer(options, function(req, res) {
// Pipe the data coming from a source (called a ReadableStream) to a destination (called a WritableStream)
  var url = parse(req.url);
// Construct absolute path //
  var path = join(root, url.pathname);
  var stream = fs.createReadStream(path);
  stream.pipe(res);
// Checo for file existence //
  fs.stat(path, function(err, stat) {
    if (err) {
// File doesn't exist //
      if ('ENOENT' == err.code) {
	res.statusCode = 404;
	res.end('Not Found');
      }
      else if {
	res.statusCode = 500;
	res.end('Internal Server Error');
      }
      else {
// Set Content-Length using stat object //
	res.setHeader('Content-Length', stat.size);
	var stream = fs.createReadStream(path);
	stream.pipe(res);
	stream.on('error', function(err) {
	  res.statusCode = 500;
	  res.end('Internal Server Error');
	});
// req.method is the HTTP method requested. //
  switch (req.method) {
    case 'POST':
// Set up string buffer for the incoming item. //
      var item = '';
// Encode incoming data events as UTF-8 strings. //
      req.setEncoding('utf8');
      req.on('data', function(chunk) {
// Concatenate data chunk onto the buffer. //
	item += chunk;
      });

// Push complete new item onto the items array //
      req.on('end', function() {
	items.push(item);
	res.end('OK\n');
      });
      break;
    case 'GET':
      items.forEach(function(item, i) {
	res.write(i + ') ' + item + '\n');
      });
      res.end();
      break;
    case 'DELETE':
      var path_2 = url.parse(req.url).pathname;
      var i = parseInt(path_2.slice(1), 10);
// Check that the number is valid. //
      if (isNaN(i)) {
	res.statusCode = 400;
	res.end('Invalid item id');
      }
//Ensure the requested index exists. //
      else if (!items[i]) {
	res.statusCode = 404;
	res.end('Item not found');
      }
      else {
// Delete the requested item. //
	items.splice(i, 1);
	res.end('OK\n');
      }
      break;
    case 'POST':
      upload(req, res);
      break;
  }

});
// Serve HTML form with file input //
function upload(req, res) {
// respond with 400 Bad Request when the request doesn't appear to contain the appropriate type of content. //
  if (!isFormData(req)) {
    res.statusCode = 400;
    res.end('Bad Request: expecting multipart/form-data');
    return;
  }
  else {
// Using formidable's API //
  var form = new formidable.IncomingForm();
// upload logic //
  form.parse(req, function(err, fields, files) {
    console.log(fields);
    console.log(files);
    res.end('upload complete!');
  });
  form.on('progress', function(bytesReceived, bytesExpected) {
    var percent = Math.floor(bytesReceived / bytesExpected * 100);
    console.log(percent);
  }); 
  form.parse(req);
}
server.listen(3000)
