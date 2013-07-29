var flow = require ('nimble');
var exec = require ('child_process').exec;

// Download Node source code for given version //
function downloadNodeVersion(version, destination, callback) {
   var url = 'http://nodejs.org/dist/node-v' + version + '.tar.gz';
   var filepath = destination + '/' + version + '.tgz';
   exec('curl' + url + ' >' + filepath, callback);
}
//Executes series of tasks in sequence//
flow.series([
  function (callback) {
// Executes download in parallel //
     flow.parallel([
       function (callback) {
	 console.log('Downloading node v0.4.6...');
       }
     ], callback);
  },
  function (callback) {
    console.log('Creating archive of downloaded files...');
// Create archive file//
    exec(
      'tar cvf node_distros.tar /tmp/0.4.6.tgz /tmp/0.4.7.tgz',
      function(error, stdout, stderr) {
	console.log('All done!');
	callback();
      }
    );
  }
]);
