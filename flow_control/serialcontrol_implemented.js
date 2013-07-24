var fs = require('fs');
var request = require('request');
var htmlparser = require('htmlparser');
var configFilename = './rss_feeds.txt';

// Task 1:Make sure file containing the list of RSS feed URLS exists. //
function checkForRSSFile () {
  fs.exists(configFilename, function(exists) { 
    if (!exists)
      return next(new Error('Missing RSSfile:' + configFilename)); //Whenever there is an error, return early.//
      next(null, configFilename);
  });
}
// Task 2: Read and parse file containing the feed RLS. //
function readRSSFile (configFilename) { 
  fs.readFile(configFilename, function(err, feedList) {
    if (err) return next(err);
    // convert list of feed URLS to a string and then into an array of feed URLS. //
    feedList = feedList
               .toString()
               .replace(/^\s+|\s+$/g, '')
               .split("\n");
   // Select random feed URL from arry of feed URLS. //
    var random = Math.floor(Math.random() * feedList.length);
    next(null, feedList[random]);
  });
}   
// Task 3: Do an HTTP request and get data for the selected feed. //
function downloadRSSFeed (feedUrl) {
  request({uri: feedUrl}, function(err, res, body) {
    if (err) return next(err);
    if (res.statusCode != 200)
      return next(new Error('Abnormal response status code'));
    next(null, body);
  });
}
// Task 4: Parse RSS data into array of items.//
function parseRSSFeed (rss) {
  var handler = new htmlparser.RssHandler();
  var parser = new htmlparser.Parser(handler);
  parser.parseComplete(rss);
  if (!handler.dom.items.length)
    return next(new Error('No RSS items found'));
  var item = handler.dom.items.shift();
  // Display title and URL of the first feed item, if it exists. //
  console.log(item.title);
  console.log(item.link);
}
// Add each task to be performed to an array in execution order. //
var tasks = [ checkForRSSFile,
              readRSSFile,
              downloadRSSFeed,
              parseRSSFeed ];
// A function called next executes each task //
function next (err, result) {
  if (err) throw err; // Throw exception if task encounters an error //
  var currentTask = tasks.shift(); //Next task comes from array of tasks. //
  if (currentTask) {
    currentTask(result); // Execute current task. //
  }
}
next(); // Start serial execution of tasks. // 
  
  
