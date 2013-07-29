var events = require('events');
var net = require('net');
var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};
channel.on('join', function(id, client) {
// Add a listener for the join event that stores a user's client object, allowing the application to send data back to the user.//
  this.clients[id] = client;
  this.subscriptions[id] = function(senderId, message) {
// Ignore data if it's been directly broadcast by the user. //
    if (id != senderId) {
      this.clients[id].write(message);
    }
  };
// Add a listener, specific to the current user, for the broadcast event. //
  this.on('broadcast', this.subscriptions[id]);
});
// Create listener for leave event. //
channel.on('leave', function(id) {
// Remove broadcast listener for specific client. //
  channel.removeListener('broadcast', this.subscriptions[id]);
  channel.emit('broadcast', id, id + " has left the chat. \n");
});



var server = net.createServer(function (client) {
  var id = client.remoteAddress + ':' + client.remotePort;
  client.on('connect', function() {
// Emit a join event when a user connects to the server, specifying the user ID and client object. //
    channel.emit('join', id, client);
  });

  client.on('data', function(data) {
    data = data.toString();
// Emit a channel broadcast event, specifying the user ID and message,when any user sends data. //
    channel.emit('broadcast', id, data);
  });
// Emit leave event when client disconnects. //
  client.on('close', function() {
    channel.emit('leave', id);
  });
});
server.listen(8888);
