var fs = require('fs');
var completedTasks = 0;
var tasks = [];
var wordCounts = {};
var filesDir = './text';
function checkIfComplete() {
  completedTasks++;
  if (completedTasks == tasks.length) {
    // When all tasks have completed, list each word used in the files and how many times it was used.//
    for (var index in wordCounts) {
      console.log(index +': ' + wordCounts[index]);
    }
  }
}
function countWordsInText(text) {
  var words = text
    .toString()
    .toLowerCase()
    .split(/\W+/)
    .sort();
  // Count word occurences in text. //
  for (var index in words) {
    var word = words[index];
    if (word) {
      wordCounts[word] = (wordCount[word]) ? wordCounts[word] + 1 : 1;
    }
  }
}      

// Get a list of the files in the text directory. //
fs.readdit(filesDir, function(err, files) {
  if (err) throw err;
  for (var index in files) {
    // Define a task to handle each file. Each task includes a call to a function that will asynchronously read the file and then count the file's word usage. //
    var task = (function(file) {
      return function() {
        fs.readFile(file, function(err, text) {
          if (err) throw err;
          countWordsinText(text);
          checkIfComplete();
        });
      }
}) (filesDir + '/' + files[index]);
tasks.push(task); // Add each task to an array of functions to call in parallel.//

// Start executing every task in parallel. //
for (var task in tasks) {
  tasks[task]();
}
});
  

        

    
