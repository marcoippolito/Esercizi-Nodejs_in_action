var Readable = require('stream').Readable;

var rs = Readable();
rs.push('beep');
rs.push('boop\n');
rs.push(null);
rs.pipe(process.stdout);

var c = 97 - 1;
var rs2 = Readable();
rs2._read = function() {
  rs2.push(String.fromCharCode(++c));
  if (c >= 'z'.charCodeAt(0)) {
    rs2.push(null);
  }
};
rs2.pipe(process.stdout);
