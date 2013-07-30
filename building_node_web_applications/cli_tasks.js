var fs = require('fs');
var path = require('path');
// splice out 'node cli_tasks.js' to have just the arguments. //
var args = process.argv.splice(2);
// pull out the first argument. This is the command //
var command = args.shift();
// join the remaining arguments //
var taskDescription = args.join(' ');
// resolve database path relative to the current working directory //
var file = path.join(process.cwd(), '/.tasks');
switch (command) {
// 'list' will list all the tasks stored//
  case 'list':
    listTasks(file);
    break;
// 'add' will add a new task //
  case 'add':
    addTask(file, taskDescription);
    break;
// anything else or no command will show command use //
  default:
    console.log('Usage: ' + process.argv[0] + ' list|add [taskDescription]');
}
function loadOrInitializeTaskArray(file, cb) {
// Check if todo file already exists //
  fs.exists(file, function(exists) {
    var tasks = [];
    if (exists) {
// Read todo data from todo file //
      fs.readFile(file, 'utf8', function(err, data) {
	if (err) {
	  throw err;
	}
	else {
	  var data = data.toString();
// Parse JSON-encoded todo data into an array of tasks //
	  var tasks = JSON.parse(data);
	  cb(tasks);
	}
      });
    }
    else {
      cb([]);
    }
  });
}
// Use loadOrInitializaTaskArray helper function to implement the listTasks functionality //
function listTasks(file) {
  loadOrInitializeTaskArray(file, function(tasks) {
    for(var i in tasks) {
      console.log(tasks[i]);
    }
  });
}
// store JSON-serialized tasks into a file. //
function storeTasks(file, tasks) {
  fs.writeFile(file, JSON.stringify(tasks), 'utf8', function(err) {
    if (err) {
      throw err;
    }
    else {
      console.log('Saved.');
  });
}
// use storeTasks helper function to implement the addTask functionality. //
function addTask(file, taskDescription) {
  loadOrInitializeTaskArray(file, function(tasks) {
    tasks.push(taskDescription);
    storeTasks(file, tasks);
  });
}
